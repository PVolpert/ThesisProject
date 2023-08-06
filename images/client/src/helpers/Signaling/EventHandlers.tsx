import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { UserId } from './User';
import { createIceCandidateMessage, createSDPMessage } from './Messages';
import { getUserMediaErrorHandler } from './UserMedia';

export function buildOnIceCandidateHandler(
    target: UserId,
    sendJsonMessage: SendJsonMessage
) {
    return (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
            const newTarget = target;

            console.log('Sending ICE Candidate');
            const msg = createIceCandidateMessage(newTarget, event.candidate);
            sendJsonMessage(msg);
        }
    };
}

export function buildOnTrackHandler(
    setRemoteStreams: React.Dispatch<
        React.SetStateAction<readonly MediaStream[]>
    >
) {
    return (event: RTCTrackEvent) => {
        setRemoteStreams(event.streams);
    };
}

export function buildOnNegationNeededHandler(
    target: UserId,
    sendJsonMessage: SendJsonMessage,
    RTCConnection: RTCPeerConnection
) {
    return async () => {
        try {
            const offer = await RTCConnection.createOffer();
            await RTCConnection.setLocalDescription(offer);
            const desc = RTCConnection.localDescription;
            if (!desc) {
                throw 'Invalid local description';
            }
            //TODO Add ict here
            const msg = createSDPMessage('call-offer', target, desc);
            sendJsonMessage(msg);
        } catch (error) {
            getUserMediaErrorHandler(error);
            // TODO navigate to /call
        }
    };
}

export function buildOnIceConnectionStateChangeHandler(
    RTCConnection: RTCPeerConnection
) {
    return () => {
        if (!RTCConnection) {
            return;
        }
        switch (RTCConnection.iceConnectionState) {
            case 'closed':
            case 'failed':
                // TODO navigate to /call
                break;
        }
    };
}

export function buildOnIceGatheringStateChangeHandler() {
    return (event: Event) => {
        // console.log(event);
    };
}
