import { generateEncJWT, generateJWT } from '../Crypto/JWT';
import * as jose from 'jose';

const dhKeyClaimId = 'DHKey';

export async function generateDHJWT(
    ICTKeyPair: CryptoKeyPair,
    DHPubKey: CryptoKey
) {
    const DHPubKeyJWK = await window.crypto.subtle.exportKey('jwk', DHPubKey);

    return generateJWT(ICTKeyPair, { [dhKeyClaimId]: DHPubKeyJWK });
}

export async function verifyDHJWT(ICTPubKey: CryptoKey, DHJWT: string) {
    const { payload } = await jose.jwtVerify(DHJWT, ICTPubKey);

    if (!payload[dhKeyClaimId]) {
        throw new Error(`DHJWT does not contain ${dhKeyClaimId} claim`);
    }

    const DHPubKeyJWK = payload[dhKeyClaimId] as JsonWebKey;
    const DHPubKey = window.crypto.subtle.importKey(
        'jwk',
        DHPubKeyJWK,
        {
            name: 'ECDH',
            namedCurve: 'P-384',
        },
        true,
        []
    );
    return DHPubKey;
}

const sharedSecretClaimID = 'sha';
export async function generateSharedSecretJWT(
    DHSecret: CryptoKey,
    SharedSecret: CryptoKey
) {
    const SharedSecretJWK = await window.crypto.subtle.exportKey(
        'jwk',
        SharedSecret
    );
    console.log('Sending shared secret', SharedSecretJWK);

    return generateEncJWT(DHSecret, { [sharedSecretClaimID]: SharedSecretJWK });
}

export async function verifySharedSecretJWT(
    DHSecret: CryptoKey,
    DHJWT: string
) {
    const { payload } = await jose.jwtDecrypt(DHJWT, DHSecret);

    if (!payload[sharedSecretClaimID]) {
        throw new Error(`DHJWT does not contain ${sharedSecretClaimID} claim`);
    }

    console.log('Received shared secret', payload[sharedSecretClaimID]);

    const SharedSecret = crypto.subtle.importKey(
        'jwk',
        payload[sharedSecretClaimID],
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );

    return SharedSecret;
}
