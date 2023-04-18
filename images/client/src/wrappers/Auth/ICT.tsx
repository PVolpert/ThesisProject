import { JWTPayload, SignJWT } from 'jose';
import { IDToken } from 'oauth4webapi';
import OIDCProvider from './OIDCProvider';

/**
 * Plan for ICT Token Acquisition:
 * Acquisition invoked by Event (Click)
 * 1. Search for the correct issuer
 * 2. generateTokenRequest
 * 3. requestRemoteToken
 * --> Needs iatProvider list + valid iat OpenIDToken
 */

interface JWTBody {
    sub: string;
    nbf: number;
    nonce: number;
    token_claims: string[];
    token_lifetime: number;
    token_nonce: number;
}

interface JWTHeader {
    iat: number;
    iss: string;
    aud: string;
    exp: number;
}
/**
 * generate a JWT used to request an OpenIdToken
 * @Params
 * "keyPair" is the key used by the amount that wants to authenticate
 * "tokenClaims" are the claims present in the openId Token
 * "tokenNonce" is the nonce in the openId token
 * "tokenLifetime" is how long the token should be valid in seconds
 * @usedWith
 * generateTokenRequest generates a request token with can be used with the function: requestRemoteIdToken from this lib
 */
export async function generateTokenRequest(
    keyPair: CryptoKeyPair,
    jwtBody: JWTBody,
    { iat, iss, aud, exp }: JWTHeader
) {
    let publicKeyExp = await window.crypto.subtle.exportKey(
        'jwk',
        keyPair.publicKey
    );
    const payload = {
        ...jwtBody,
        token_claims: jwtBody.token_claims.join(' '),
    } as JWTPayload;

    return await new SignJWT(payload)
        .setProtectedHeader({
            alg: 'ES256',
            type: 'JWT',
            jwk: {
                kty: 'EC',
                crv: 'P-256',
                x: publicKeyExp.x,
                y: publicKeyExp.y,
            },
        })
        .setIssuedAt(iat)
        .setIssuer(iss)
        .setAudience(aud)
        .setExpirationTime(exp)
        .sign(keyPair.privateKey);
}

export async function requestRemoteIdToken(
    accessToken: string,
    requestToken: string,
    ridtEndpointUri: string
) {
    const headers = new Headers();

    headers.append('accept', 'application/json');
    headers.append('Authorization', 'Bearer ' + accessToken);
    headers.append('Content-Type', 'application/jwt');

    const message = {
        method: 'POST',
        headers,
        body: requestToken,
    };

    var response = await fetch(ridtEndpointUri, message);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    var body = await response.text();

    return body;
}
