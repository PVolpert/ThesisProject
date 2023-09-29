export async function signString(
    inputString: string,
    privateKey: CryptoKey
): Promise<string> {
    try {
        // Encode the input string as bytes
        const encoder = new TextEncoder();
        const inputData = encoder.encode(inputString);

        // Sign the data using ECDSA with SHA-384
        const signature = await crypto.subtle.sign(
            {
                name: 'ECDSA',
                hash: { name: 'SHA-384' },
            },
            privateKey,
            inputData
        );

        // Convert the signature to a hexadecimal string
        const signatureArray = Array.from(new Uint8Array(signature));
        const signatureHex = signatureArray
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');

        return signatureHex;
    } catch (error) {
        console.error('Error signing the string:', error);
        throw error; // You can choose to handle or propagate the error as needed.
    }
}

export async function verifyString(
    signString: string,
    input: string,
    publicKey: CryptoKey
): Promise<boolean> {
    try {
        // Encode the input string as bytes
        const encoder = new TextEncoder();
        const inputData = encoder.encode(input);

        // Decode the signature from hexadecimal format
        const signatureArray = new Uint8Array(
            signString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
        );

        // Verify the signature using ECDSA with SHA-384
        const isSignatureValid = await crypto.subtle.verify(
            {
                name: 'ECDSA',
                hash: { name: 'SHA-384' },
            },
            publicKey,
            signatureArray,
            inputData
        );

        return isSignatureValid;
    } catch (error) {
        console.error('Error verifying the signature:', error);
        throw error; // You can choose to handle or propagate the error as needed.
    }
}
