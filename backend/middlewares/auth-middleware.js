import { verifyToken } from "../utils/jwt.js";
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from "../utils/error.js";
import { ERROR_MESSAGES } from '../utils/error-messages.js';

export default async function authenticateToken(req, res, next) {
    if (req.user) return next();

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //skip "Bearer "

    if (!token) {
        throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_REQUIRED);
    }

    try {
        req.user = verifyToken(token);

        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_EXPIRED);
        }
        throw new ForbiddenError(ERROR_MESSAGES.TOKEN_INVALID);
    }
}
