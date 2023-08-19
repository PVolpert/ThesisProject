import { useEffect, useRef } from 'react';

import P2PDisplay from '../components/P2P/P2PDisplay';
import { useToken } from '../hooks/useToken';
import useRTCPeerConnection from '../hooks/useRTCPeer';
import useSignaling from '../hooks/useSignaling';

export default function P2PPage() {
    const { accessToken, signalingUrl } = useToken({ needsToken: true });
    const localRef = useRef<HTMLVideoElement>(null);
    const remoteRef = useRef<HTMLVideoElement>(null);

    // * Init WebRTC Call
    const {
        socket: { sendJsonMessage, lastJsonMessage },
    } = useSignaling({ socketUrl: signalingUrl });
    const { localStream, remoteStreams, closeCall } = useRTCPeerConnection({
        sendJsonMessage,
        lastJsonMessage,
    });

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        if (!localRef.current || !localStream.active) {
            return;
        }
        localRef.current.srcObject = localStream;

        return () => {
            closeCall();
        };
    }, [localStream, localRef]);

    // * Assign stream to video elements
    useEffect(() => {
        if (!accessToken) {
            return;
        }

        if (!remoteRef.current || !remoteStreams.at(0)?.active) {
            return;
        }
        remoteRef.current.srcObject = remoteStreams[0];
    }, [remoteStreams, remoteRef]);

    return <P2PDisplay localRef={localRef} remoteRef={remoteRef} />;
}

export function loader() {}
