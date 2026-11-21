import bcrypt from 'bcrypt';

async function hash(plain) {
    return await bcrypt.hash(plain, 10);
}

async function matchHash(plain, hashed) {
    return bcrypt.compare(plain, hashed);
}

export {
    hash,
    matchHash
};
