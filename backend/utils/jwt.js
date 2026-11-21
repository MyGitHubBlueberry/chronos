import jwt from 'jsonwebtoken';

function generateToken(payload, expiresIn = '15m') {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export { verifyToken, generateToken };
