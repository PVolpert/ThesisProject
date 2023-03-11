export default interface Signaling {
    send: (msg: SignalingMessage) => void;
    addEventListener: (
        eventType: 'message',
        // JSON version of a Signaling Message
        listener: (event: MessageEvent<string>) => void
    ) => void;
}

export interface SignalingMessage {
    candidate?: RTCIceCandidate | null;
    description?: RTCSessionDescription | null;
}
