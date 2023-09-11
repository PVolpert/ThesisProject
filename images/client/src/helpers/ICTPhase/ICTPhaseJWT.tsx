import * as jose from 'jose';
import { OPsMap } from './ICTPhase';
import { verifyICT } from '../ICT/ICT';

import { OpenIDProviderInfo } from './OpenIDProvider';
import { generateJWT } from '../Crypto/JWT';

const ictClaimID = 'ict';
const nonceClaimID = 'nce';
const OPsClaimID = 'ops';

export async function generateICTOfferJWT(
    keyPair: CryptoKeyPair,
    ict: string,
    nonce: string,
    partnerOPs: OPsMap
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
    OPs: OPsMap,
    ict: string,
    nonce: string,
    trustedOpenIDProviders: OpenIDProviderInfo[]
) {
    try {
        // Extract ICT Values
        const { OPID, identity, jwkICT } = extractUnverifiedICTValues(ict);

        // OP in OPs
        // Verify Nonce
        if (nonce !== OPs.get(OPID)) {
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

        return { publicKey, identity };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function verifyICTOffer(
    callJWT: string,
    selfOPs: OPsMap,
    trustedOpenIDProviders: OpenIDProviderInfo[]
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

    return { publicKey, identity, candidateOPs };
}

export async function verifyICTAnswer(
    JWTAnswer: string,
    selfOPs: OPsMap,
    trustedOpenIDProviders: OpenIDProviderInfo[]
) {
    // Extract unverified JWT Values
    const { ict, nonce } = extractUnverifiedICTAnswerValues(JWTAnswer);

    const { publicKey, identity } = await verifyICTMessage(
        JWTAnswer,
        selfOPs,
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

    // TODO Move to a later point

    const jwtBody = {
        ict: claimsJWT[ictClaimID] as string,
        nonce: claimsJWT[nonceClaimID] as string,
        candidateOPs: claimsJWT[OPsClaimID] as OPsMap,
    };

    return jwtBody;
}
function extractUnverifiedICTAnswerValues(callJWT: string) {
    const claimsJWT = jose.decodeJwt(callJWT);

    if (!claimsJWT[ictClaimID] || !claimsJWT[nonceClaimID]) {
        throw Error('JWT does not contain needed claims');
    }

    // TODO Move to a later point

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
        identity: {
            name: claimsICT['name'] as string,
            email: claimsICT['email'] as string,
        },
    };

    return ICTBody;
}

const targetsClaimID = 'trg';

export async function generateTargetsJWT<ID>(
    keyPair: CryptoKeyPair,
    targets: ID[],
    nonce: string
) {
    const jwt = await new jose.SignJWT({
        [targetsClaimID]: targets,
        [nonceClaimID]: nonce,
    })
        .setProtectedHeader({ alg: 'ES384' })
        .sign(keyPair.privateKey);

    return jwt;
}

export async function verifyTargetsJWT<ID>(pubKey: CryptoKey, jwt: string) {
    const { payload } = await jose.jwtVerify(jwt, pubKey);

    if (!payload[targetsClaimID] || !payload[nonceClaimID]) {
        throw Error('TargetsJWT has not the correct claims');
    }

    const targets = payload[targetsClaimID] as ID[];
    const responseNonce = payload[nonceClaimID] as string;

    return { targets, responseNonce };
}
