import { generateEncJWT, generateJWT } from '../Crypto/JWT';
import * as jose from 'jose';

const dhKeyClaimId = 'DHKey';

export async function generateDHJWT(
    ICTKeyPair: CryptoKeyPair,
    DHPubKey: CryptoKey
) {
    const DHPubKeyJWK = await crypto.subtle.exportKey('jwk', DHPubKey);

    return generateJWT(ICTKeyPair, { [dhKeyClaimId]: DHPubKeyJWK });
}

export async function verifyDHJWT(ICTPubKey: CryptoKey, DHJWT: string) {
    const { payload } = await jose.jwtVerify(DHJWT, ICTPubKey);

    if (!payload[dhKeyClaimId]) {
        throw new Error(`DHJWT does not contain ${dhKeyClaimId} claim`);
    }

    const DHPubKey = crypto.subtle.importKey(
        'jwk',
        payload[dhKeyClaimId],
        {
            name: 'ECDH',
            namedCurve: 'P-384',
        },
        false,
        ['deriveKey']
    );

    return DHPubKey;
}

const sharedSecretClaimID = 'sha';
export async function generateSharedSecretJWT(
    DHSecret: CryptoKey,
    SharedSecret: CryptoKey
) {
    const SharedSecretJWK = await crypto.subtle.exportKey('jwk', SharedSecret);

    return generateEncJWT(DHSecret, { SharedSecretJWK });
}

export async function verifySharedSecretJWT(
    DHSecret: CryptoKey,
    DHJWT: string
) {
    const { payload } = await jose.jwtDecrypt(DHJWT, DHSecret);

    if (!payload[sharedSecretClaimID]) {
        throw new Error(`DHJWT does not contain ${sharedSecretClaimID} claim`);
    }

    const DHPubKey = crypto.subtle.importKey(
        'jwk',
        payload[sharedSecretClaimID],
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );

    return DHPubKey;
}
