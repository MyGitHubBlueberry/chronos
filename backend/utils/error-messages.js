const ERROR_MESSAGES = Object.freeze({
    TOKEN_REQUIRED: 'Access token required.',
    TOKEN_INVALID: 'Access token is invalid.',
    TOKEN_EXPIRED: 'Access token expired.',
    EMAIL_TOKEN_MISSING: 'Email verification token is missing.',
    EMAIL_TOKEN_ERROR: 'Email verification token has expired or invalid. Request password reset again.',
    REFRESH_TOKEN_REVOKED: 'Refresh token is revoked. Please log in again.',
    REFRESH_TOKEN_INVALID: 'Refresh token is invalid.',
    REFRESH_TOKEN_EXPIRED: 'Refresh token has expired. Please log in again.',
    RESET_TOKEN_ERROR: 'Reset token has expired or invalid. Request password reset again.',
    RESET_TOKEN_MISSING: 'Reset token is missing.',
    INSUFFICIENT_PRIVILEGES: 'Insufficient privileges.',
    INVALID_CREDENTIALS: 'Invalid login credentials.',
    USER_NOT_FOUND: 'User not found.',
    EMAIL_IN_USE: 'Email is already in use.',
    LOGIN_IN_USE: 'Login is already in use.',
});

export { ERROR_MESSAGES };
