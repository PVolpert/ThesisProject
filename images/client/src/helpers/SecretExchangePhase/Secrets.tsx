export async function generateSharedSecret() {
    return await crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );
}

export async function generateDHPair() {
    return await window.crypto.subtle.generateKey(
        {
            name: 'ECDH',
            namedCurve: 'P-384',
        },
        false,
        ['deriveKey']
    );
}

export async function deriveDHSecret(
    selfDHKeyPair: CryptoKeyPair,
    memberPubKey: CryptoKey
) {
    return await crypto.subtle.deriveKey(
        {
            name: 'ECDH',
            public: memberPubKey,
        },
        selfDHKeyPair.privateKey,
        {
            name: 'AES-GCM',
            length: 256,
        },
        false,
        ['encrypt', 'decrypt']
    );
}
