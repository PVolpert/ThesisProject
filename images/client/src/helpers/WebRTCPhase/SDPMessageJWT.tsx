import * as jose from 'jose';
import { generateJWT, jwtBody } from '../Crypto/JWT';

interface SDPMessageBody extends jwtBody {
    msg: RTCSessionDescription;
}

export async function generateSDPMessage(
    msg: RTCSessionDescription,
    keyPair: CryptoKeyPair
) {
    const SDPMessageBody: SDPMessageBody = {
        msg,
    };

    return generateJWT(keyPair, SDPMessageBody);
}

export async function verifySDPMessage(jwt: string, publicKey: CryptoKey) {
    const { payload } = await jose.jwtVerify(jwt, publicKey);

    if (!payload['msg']) {
        throw Error('SDP Message is missing the message');
    }

    return payload['msg'] as RTCSessionDescription;
}
