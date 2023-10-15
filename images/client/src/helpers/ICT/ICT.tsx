import { SignPoPToken, getIctEndpoint, requestIct } from 'oidc-squared';
import * as jose from 'jose';
import { TokenSet } from '../../store/slices/ICTAccessTokenSlice';
import { OpenIDProviderInfo } from '../ICTPhase/OpenIDProvider';

export function createKeyPair() {
    return window.crypto.subtle.generateKey(
        {
            name: 'ECDSA',
            namedCurve: 'P-384',
        },
        false,
        ['sign', 'verify']
    );
}

export async function getICT(
    keyPair: CryptoKeyPair,
    { accessToken, idToken }: TokenSet,
    oidcProvider: OpenIDProviderInfo
) {
    try {
        const publicJwk = await crypto.subtle.exportKey(
            'jwk',
            keyPair.publicKey
        );

        const popToken = await new SignPoPToken() // Also sets "iat" to now, "exp" to in 60 seconds, and "jti" to a new UUID.
            .setPublicKey('ES384', publicJwk) // Sets the public key and its algorithm.
            .setIssuer(oidcProvider.clientID) // Sets Issuer (= Client ID).
            .setSubject(idToken.sub) // Sets Subject (= End-User's Subject ID).
            .setAudience(oidcProvider.issuer) // Sets Audience (= OpenID Provider's Issuer URL).
            .setRequiredClaims(['name', 'email']) // (Optional) Sets the requested required claims for the ICT.
            .setWithAudience(true) // Sets whether the audience claim should be present in the ICT.
            .sign(keyPair.privateKey);

        // If not yet known, you can request the ICT Endpoint from the Discovery Document:
        const ictEndpoint = await getIctEndpoint(oidcProvider.issuer);

        // Request ICT from ICT Endpoint:
        const ictResponse = await requestIct({
            ictEndpoint, // Provide ICT Endpoint here.
            accessToken, // Insert Access Token for authorization here.
            popToken, // Insert previously generated PoP Token here.
        });

        // The ICT can be found in the identity_certification_token parameter of the response.
        const ict = ictResponse.identity_certification_token;

        return ict;
    } catch (error) {
        console.log(error);
    }
}

export async function verifyICT(ict: string, oidcProvier: OpenIDProviderInfo) {
    try {
        const jwksURI = oidcProvier.ictURI;

        const JWKS = jose.createRemoteJWKSet(new URL(jwksURI));

        return !!(await jose.jwtVerify(ict, JWKS));
    } catch (error) {
        return false;
    }
}
