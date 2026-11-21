import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

async function hash(plain) {
    return await bcrypt.hash(plain, 10);
}

async function matchHash(plain, hashed) {
    return bcrypt.compare(plain, hashed);
}

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export {
    hash,
    matchHash,
    hashToken
};
