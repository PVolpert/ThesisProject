import * as jose from 'jose';

export interface jwtBody {}

export async function generateJWT(keyPair: CryptoKeyPair, jwtBody: jwtBody) {
    try {
        const jwt = await new jose.SignJWT({ ...jwtBody })
            .setProtectedHeader({ alg: 'ES384' })
            .sign(keyPair.privateKey);

        return jwt;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function generateEncJWT(DHSecret: CryptoKey, jwtBody: jwtBody) {
    try {
        const jwt = await new jose.EncryptJWT({ ...jwtBody })
            .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
            .encrypt(DHSecret);

        return jwt;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
