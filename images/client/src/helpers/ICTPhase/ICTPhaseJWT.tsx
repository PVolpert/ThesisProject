import * as jose from 'jose';
import { Identity, OPNMap } from './ICTPhase';
import { verifyICT } from './ICT';

import { ICTProviderInfo } from './OpenIDProvider';
import { generateJWT } from '../Crypto/JWT';

const ictClaimID = 'ict';
const nonceClaimID = 'nce';
const OPsClaimID = 'ops';

export async function generateICTOfferJWT(
    keyPair: CryptoKeyPair,
    ict: string,
    nonce: string,
    partnerOPs: OPNMap
) {
    const ictOfferBody = {
        [ictClaimID]: ict,
        [nonceClaimID]: nonce,
        [OPsClaimID]: partnerOPs,
    };
    return generateJWT(keyPair, ictOfferBody);
}
export async function generateICTAnswerMessage(
    keyPair: CryptoKeyPair,
    ict: string,
    nonce: string
) {
    const ictAnswerBody = {
        [ictClaimID]: ict,
        [nonceClaimID]: nonce,
    };
    return generateJWT(keyPair, ictAnswerBody);
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
        const { OPID, userIdentity, jwkICT } = extractUnverifiedICTValues(ict);

        // OP in OPs
        // Verify Nonce
        if (nonce !== (await OPs.get(OPID))) {
            throw Error('Given nonce and supplied nonce do not match');
        }

        const OIDCProvider = trustedOpenIDProviders.find((oidcProvider) => {
            return oidcProvider.name === OPID;
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
            jwkICT,
            {
                name: 'ECDSA',
                namedCurve: 'P-384',
            },
            false,
            ['sign']
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
        console.log(error);
        throw error;
    }
}

export async function verifyICTOfferJWT(
    callJWT: string,
    selfOPs: OPNMap,
    trustedOpenIDProviders: ICTProviderInfo[]
) {
    // Extract unverified JWT Values
    const { ict, nonce, candidateOPs } =
        extractUnverifiedICTOfferValues(callJWT);

    const { publicKey, identity } = await verifyICTMessage(
        callJWT,
        selfOPs,
        ict,
        nonce,
        trustedOpenIDProviders
    );

    return {
        receivedICTPubKey: publicKey,
        identity,
        receivedOPNMap: candidateOPs,
    };
}

export async function verifyICTAnswerJWT(
    ictAnswer: string,
    issuedOPNMap: OPNMap,
    trustedOpenIDProviders: ICTProviderInfo[]
) {
    // Extract unverified JWT Values
    const { ict, nonce } = extractUnverifiedICTAnswerValues(ictAnswer);

    const { publicKey, identity } = await verifyICTMessage(
        ictAnswer,
        issuedOPNMap,
        ict,
        nonce,
        trustedOpenIDProviders
    );

    return { publicKey, identity };
}

function extractUnverifiedICTOfferValues(callJWT: string) {
    const claimsJWT = jose.decodeJwt(callJWT);

    if (
        !claimsJWT[ictClaimID] ||
        !claimsJWT[nonceClaimID] ||
        !claimsJWT[OPsClaimID]
    ) {
        throw Error('JWT does not contain needed claims');
    }

    const jwtBody = {
        ict: claimsJWT[ictClaimID] as string,
        nonce: claimsJWT[nonceClaimID] as string,
        candidateOPs: claimsJWT[OPsClaimID] as OPNMap,
    };

    return jwtBody;
}
function extractUnverifiedICTAnswerValues(callJWT: string) {
    const claimsJWT = jose.decodeJwt(callJWT);

    if (!claimsJWT[ictClaimID] || !claimsJWT[nonceClaimID]) {
        throw Error('JWT does not contain needed claims');
    }

    const jwtBody = {
        ict: claimsJWT['ict'] as string,
        nonce: claimsJWT['nonce'] as string,
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
        OPID: claimsICT.iss as string,
        jwkICT: claimsICT['cnf'] as Pick<
            jose.JWK,
            'kty' | 'crv' | 'x' | 'y' | 'e' | 'n'
        >,
        userIdentity: {
            name: claimsICT['name'] as string,
            mail: claimsICT['email'] as string,
        },
    };

    return ICTBody;
}
