const { verifyToken } = require("../utils/jwt");
const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError, BadRequestError } = require("../utils/error");
const { ERROR_MESSAGES } = require('../utils/error-messages');

export default authenticateToken = async function(req, res, next) {
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
