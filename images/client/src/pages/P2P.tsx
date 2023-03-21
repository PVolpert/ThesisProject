import { useEffect, useRef } from 'react';

import P2PDisplay from '../components/P2P/P2PDisplay';
import useLocalStream from '../hooks/useLocalStream';
import { useToken } from '../hooks/useToken';

// TODO Model Signaling from Peer A to Peer B: Direct Call, later Friends
// TODO Model IAT Exchange and Verification

// TODO Model Steps required for building a video connection

export default function P2PPage() {
    const { accessToken } = useToken({ needsToken: true });
    const localRef = useRef<HTMLVideoElement>(null);
    const remoteRef = useRef<HTMLVideoElement>(null);

    // * Init WebRTC Call
    const localStream = useLocalStream();

    // * Assign stream to video elements
    useEffect(() => {
        if (!accessToken) {
            return;
        }

        if (!localRef.current) {
            //|| !remoteRef.current?.srcObject) {
            return;
        }
        if (!localStream.getTracks()) {
            //  || !remoteStreams) {
            return;
        }
        localRef.current.srcObject = localStream;
        //remoteRef.current.srcObject = remoteStreams[0];

        return () => {
            if (!localStream.getTracks()) {
                //  || !remoteStreams) {
                return;
            }
            localStream.getTracks().forEach((track) => track.stop());
        };
    }, [localStream, localRef, remoteRef]);

    return <P2PDisplay localRef={localRef} remoteRef={remoteRef} />;
}

export function loader() {}
