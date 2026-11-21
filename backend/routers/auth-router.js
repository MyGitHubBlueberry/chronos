import express from 'express';
import auth from '../controllers/auth-controller.js';
import validate from   '../middlewares/validate-middleware.js';
import authenticateToken from '../middlewares/auth-middleware.js';
import { jwtRefreshSchema, loginSchema, emailSchema, passwordResetSchema, registerSchema } from '../validators/auth-validator.js';

const router = express.Router();

router.post("/register",
    validate(registerSchema),
    auth.register);
router.post("/login",
    validate(loginSchema),
    auth.login);
router.post("/refresh-jwt",
    validate(jwtRefreshSchema),
    auth.refreshJwt);

router.post("/resend-email-verification",
    validate(emailSchema),
    auth.requestEmailVerification);
router.post("/resend-password-reset-verification",
    authenticateToken,
    validate(emailSchema),
    auth.requestPasswordResetEmail);

router.post("/confirm-email/:confirm_token",
    auth.confirmEmail);
router.post("/password-reset/:confirm_token",
    validate(passwordResetSchema),
    auth.confirmPasswordReset);

export default router;
