const express = require('express');
const auth = require('../controllers/auth-controller');

const router = express.Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/refresh-jwt", auth.refreshJwt);

router.post("/resend-email-verification", auth.requestEmailVerification);
router.post("/confirm-email/:confirm_token", auth.confirmEmail);
router.post("/password-reset", auth.passwordResetRequest);
router.post("/resend-password-reset-verification", auth.requestEmailVerification);
router.post("/password-reset/:confirm_token", auth.passwordResetConfirm);

module.exports = router;
