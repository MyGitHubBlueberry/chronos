const ERROR_MESSAGES = Object.freeze({
    TOKEN_REQUIRED: 'Access token required.',
    TOKEN_EXPIRED: 'Access token is expired. Please log in again.',
    TOKEN_INVALID: 'Access token is invalid.',
    INSUFFICIENT_PRIVILEGES: 'Insufficient privileges.',
    INVALID_CREDENTIALS: 'Invalid login credentials.',
    USER_NOT_FOUND: 'User not found.',
    EMAIL_IN_USE: 'Login or email is already in use.'
});

module.exports = {
    ERROR_MESSAGES,
};
