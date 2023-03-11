// https://www.w3.org/TR/webrtc/#simple-peer-to-peer-example

import { useState } from 'react';
import Signaling from '../model/Signaling';

export interface useRTCPeerProps {
    configuration: RTCConfiguration;
    stream: MediaStream | null;
    onRemoteTrackHandler: (event: RTCTrackEvent) => void;
    signaling: Signaling;
}
export interface useRTCPeer {
    startCallHandler: () => void;
    stopCallHandler: () => void;
    isRTCActive: boolean;
}

let peerConnection: RTCPeerConnection | null = null;
export default function useRTCPeer({
    configuration,
    stream,
    onRemoteTrackHandler,
    signaling,
}: useRTCPeerProps): useRTCPeer {
    const [isRTCActive, setRTCActive] = useState(false);

    function startCallHandler() {
        if (peerConnection) {
            console.error('existing peerConnection');
            return;
        }
        // Create & Add EventHandlers
        createPeerConnection();
        // Enable PeerConnection to receive messages
        signaling.addEventListener('message', messageHandler);
        setRTCActive(true);
        return;
    }

    function stopCallHandler() {
        if (!peerConnection) {
            console.error('rtcPeerConnection not set');
            return;
        }
        peerConnection.close();
        peerConnection = null;
        setRTCActive(false);
        return;
    }

    function createPeerConnection() {
        peerConnection = new RTCPeerConnection(configuration);

        peerConnection.addEventListener('icecandidate', iceCandidateHandler);
        peerConnection.addEventListener(
            'negotiationneeded',
            negotiationNeededHandler
        );
        peerConnection.addEventListener('track', onRemoteTrackHandler);
        if (stream) {
            addStream(peerConnection, stream);
        }
    }

    function iceCandidateHandler({ candidate }: RTCPeerConnectionIceEvent) {
        signaling.send({ candidate });
    }

    async function negotiationNeededHandler() {
        try {
            if (!peerConnection) {
                throw new Error('rtcPeerConnection not set');
            }
            // ? Here the SDP could be changed
            await peerConnection.setLocalDescription();
            signaling.send({
                description: peerConnection.localDescription,
            });
            return;
        } catch (err) {
            console.log(err);
        }
    }

    // ! This breaks Open/Closed
    async function messageHandler({ data }: MessageEvent<string>) {
        try {
            if (!peerConnection) {
                throw new Error('rtcPeerConnection not set');
            }
            const { description, candidate } = JSON.parse(data);
            if (description) {
                await peerConnection.setRemoteDescription(description);
                // if we got an offer, we need to reply with an answer
                if (description.type === 'offer') {
                    await peerConnection.setLocalDescription();
                    signaling.send({
                        description: peerConnection.localDescription,
                    });
                }
            } else if (candidate) {
                await peerConnection.addIceCandidate(candidate);
            }
        } catch (err) {
            console.error(err);
        }
    }

    function addStream(peerConnection: RTCPeerConnection, stream: MediaStream) {
        stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
        });
    }

    return { startCallHandler, stopCallHandler, isRTCActive };
}
