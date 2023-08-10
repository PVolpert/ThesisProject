import { OIDCProviderInfo } from '../Auth/OIDCProviderInfo';
import { UserId } from '../Signaling/User';

export async function requestICTs(callPartner: UserId) {
    const nonce = await gatherNonce(callPartner);

    const ictProviders = [] as OIDCProviderInfo[];

    const ICTs = await Promise.all(
        ictProviders.map(async (ictProvider) => {
            const keyPair = await createKeyPair();
            const [ict, pop] = await Promise.all([
                requestICT(ictProvider, keyPair),
                createPoP(nonce, keyPair.privateKey),
            ]);
            return {
                keyPair,
                ict,
                pop,
            };
        })
    );

    return ICTs;
}

async function gatherNonce(callPartner: UserId) {
    // TODO: differentiate between caller and callee for nonce
    return 'dummyNonce';
}

function createKeyPair() {
    return window.crypto.subtle.generateKey(
        {
            name: 'ECDSA',
            namedCurve: 'P-384',
        },
        true,
        ['sign', 'verify']
    );
}

async function createPoP(nonce: string, privKey: CryptoKey) {
    let enc = new TextEncoder();
    const PoP = await window.crypto.subtle.sign(
        {
            name: 'ECDSA',
            hash: { name: 'SHA-384' },
        },
        privKey,
        enc.encode(nonce)
    );

    return PoP;
}

async function requestICT(
    ictProvider: OIDCProviderInfo,
    keyPair: CryptoKeyPair
) {
    // Generate ICT
    // ! Here we use Jonas' Implementation (hopefully)

    return 'DummyICT';
}
