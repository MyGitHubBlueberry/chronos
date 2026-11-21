import DbUser from '../models/user.js';
import DbRefreshToken from '../models/refreshToken.js';
import { ERROR_MESSAGES } from '../utils/error-messages.js';
import { hash, matchHash, hashToken } from '../utils/hasher.js';
import { generateToken } from '../utils/jwt.js';
import crypto from 'node:crypto'
import { ForbiddenError, ConflictError, UnauthorizedError, BadRequestError } from '../utils/error.js';

const REFRESH_TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;


export default class AuthController {
    static async register(req, res) {
        const { login, email, password, display_name, country_code, timezone } = req.body;
        let user = await DbUser.findOne({ login });
        if (user) {
            throw new ConflictError(ERROR_MESSAGES.LOGIN_IN_USE);
        }
        user = await DbUser.findOne({ email });
        if (user) {
            throw new ConflictError(ERROR_MESSAGES.EMAIL_IN_USE);
        }

        const password_hash = await hash(password);
        const email_verification_token = generateRandomToken();

        user = new DbUser({
            login, email, display_name, password_hash,
            email_verification_token, country_code, timezone
        });

        await user.save();

        //todo: send mail

        return res.status(201).json({
            message: "User registered. " +
                "Please, check your email for verification."
        });
    }

    static async login(req, res) {
        const { login, password } = req.body;

        const user = await DbUser.findOne({ login });

        if (!user || !(await matchHash(password, user.password_hash))) {
            throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        if (!user.is_email_confirmed) {
            throw new ForbiddenError("Please, verify your email.");
        }

        const refresh = generateRandomToken();

        await DbRefreshToken.findOneAndUpdate(
            { user: user._id },
            {
                token_hash: hashToken(refresh),
                expires_at: new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS),
                revoked: false,
            },
            { upsert: true }
        );

        res.json({
            refresh,
            jwt: generateToken({ id: user.id }),
            user: user.getPublicFields(),
        });
    }

    static async refreshJwt(req, res) {
        const { token } = req.body;
        const tokenTable = await DbRefreshToken.findOne({ token_hash: hashToken(token) }).populate('user');

        if (!tokenTable) {
            throw new ForbiddenError(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
        }

        if (tokenTable.revoked) {
            throw new ForbiddenError(ERROR_MESSAGES.REFRESH_TOKEN_REVOKED);
        }

        if (tokenTable.expires_at < Date.now()) {
            throw new ForbiddenError(ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED);
        }

        const user = tokenTable.user;
        const refresh = generateRandomToken();

        tokenTable.token_hash = hashToken(refresh);
        tokenTable.expires_at = new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS);

        await tokenTable.save();

        res.json({
            refresh,
            jwt: generateToken({ id: user.id })
        });
    }

    //todo: email staff
    static async requestPasswordResetEmail(req, res) { }
    static async requestEmailVerification(req, res) { }

    static async confirmEmail(req, res) {
        const { confirm_token } = req.params;

        if (!confirm_token) {
            throw new BadRequestError(ERROR_MESSAGES.EMAIL_TOKEN_MISSING);
        }

        const user = await DbUser.findOne({ email_verification_token: confirm_token });

        if (!user) {
            throw new BadRequestError(ERROR_MESSAGES.EMAIL_TOKEN_ERROR);
        }

        user.is_email_confirmed = true;
        user.email_verification_token = null;
        await user.save();

        return res.json({ message: "Account verified successfully." });
    }

    static async confirmPasswordReset(req, res) {
        const { confirm_token } = req.params;
        const { new_password } = req.body;

        const user = await DbUser.findOne({ password_reset_token: confirm_token });

        if (!user) {
            throw new BadRequestError(ERROR_MESSAGES.RESET_TOKEN_ERROR);
        }

        user.password_hash = await hash(new_password);
        user.password_reset_token = null;
        user.password_reset_token_expires = null;

        await user.save();

        res.json({ message: "Password updated successfully." })
    }
}

function generateRandomToken() {
    return crypto.randomBytes(32).toString('hex');
}
