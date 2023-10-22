import * as jose from 'jose';
import { Identity, OPNMap } from './ICTPhase';
import { verifyICT } from './ICT';

import { ICTProviderInfo } from './OpenIDProvider';
import { generateJWT } from '../Crypto/JWT';

const ictClaimID = 'ict';
const nonceClaimID = 'nce';

export async function generateICTMessageJWT(
    keyPair: CryptoKeyPair,
    ict: string,
    nonce: string
) {
    const ictMsgBody = {
        [ictClaimID]: ict,
        [nonceClaimID]: nonce,
    };
    return generateJWT(keyPair, ictMsgBody);
}

export async function verifyICTMessageJWT(
    callJWT: string,
    issuedOPNMap: OPNMap,
    trustedOpenIDProviders: ICTProviderInfo[]
) {
    // Extract unverified JWT Values
    const { ict, nonce } = extractUnverifiedICTMessageValues(callJWT);

    const { publicKey, identity } = await verifyICTMessage(
        callJWT,
        issuedOPNMap,
        ict,
        nonce,
        trustedOpenIDProviders
    );

    return {
        receivedICTPubKey: publicKey,
        identity,
    };
}

async function verifyICTMessage(
    callJWT: string,
    OPs: OPNMap,
    ict: string,
    nonce: string,
    trustedOpenIDProviders: ICTProviderInfo[]
) {
    try {
        // Extract ICT Values
        const { issuer, userIdentity, jwkICT } =
            extractUnverifiedICTValues(ict);

        // OP in OPs
        // Verify Nonce
        if (nonce !== (await OPs.get(issuer))) {
            throw Error('Given nonce and supplied nonce do not match');
        }

        const OIDCProvider = trustedOpenIDProviders.find((oidcProvider) => {
            return oidcProvider.issuer === issuer;
        });

        if (!OIDCProvider) {
            throw Error('Issuing OpenID Provider not supported');
        }

        // Verify ICT
        if (!(await verifyICT(ict, OIDCProvider))) {
            throw Error('ICT is invalid');
        }

        const publicKey = await window.crypto.subtle.importKey(
            'jwk',
            {
                kty: jwkICT.jwk.kty,
                crv: jwkICT.jwk.crv,
                x: jwkICT.jwk.x,
                y: jwkICT.jwk.y,
                use: 'sig',
            },
            {
                name: 'ECDSA',
                namedCurve: 'P-384',
            },
            true,
            ['verify']
        );

        if (!(await jose.jwtVerify(callJWT, publicKey))) {
            throw Error('JWT is invalid');
        }

        return {
            publicKey,
            identity: {
                ...userIdentity,
                issName: OIDCProvider.name,
                issImg: OIDCProvider.img,
            } as Identity,
        };
    } catch (error) {
        throw error;
    }
}

function extractUnverifiedICTMessageValues(callJWT: string) {
    const claimsJWT = jose.decodeJwt(callJWT);

    if (!claimsJWT[ictClaimID] || !claimsJWT[nonceClaimID]) {
        throw Error('JWT does not contain needed claims');
    }

    const jwtBody = {
        ict: claimsJWT[ictClaimID] as string,
        nonce: claimsJWT[nonceClaimID] as string,
    };

    return jwtBody;
}

function extractUnverifiedICTValues(ict: string) {
    const claimsICT = jose.decodeJwt(ict);

    if (
        !claimsICT.iss ||
        !claimsICT['cnf'] ||
        !claimsICT['name'] ||
        !claimsICT['email']
    ) {
        throw Error('JWT does not contain needed claims');
    }

    const ICTBody = {
        issuer: claimsICT.iss as string,
        jwkICT: claimsICT['cnf'] as {
            jwk: { crv: string; kty: string; x: string; y: string };
        },
        userIdentity: {
            name: claimsICT['name'] as string,
            mail: claimsICT['email'] as string,
        },
    };

    return ICTBody;
}
