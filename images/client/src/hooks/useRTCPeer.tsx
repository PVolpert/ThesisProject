import { useCallback, useEffect, useMemo, useState } from 'react';
import { useZustandStore } from '../stores/zustand/ZustandStore';
import useSignaling from './useSignaling';
import {
    Message,
    createHangUpMessage,
    createSDPMessage,
} from '../wrappers/Signaling/Messages';
import { useNavigate } from 'react-router-dom';
import {
    incomingAnswerHandler,
    validateHangUp,
    incomingIceCandidateHandler,
    incomingOfferHandler,
} from '../wrappers/Signaling/MessageHandlers';
import {
    buildOnIceCandidateHandler,
    buildOnIceConnectionStateChangeHandler,
    buildOnIceGatheringStateChangeHandler,
    buildOnNegationNeededHandler,
    buildOnTrackHandler,
} from '../wrappers/Signaling/EventHandlers';
import {
    getUserMedia,
    getUserMediaErrorHandler,
} from '../wrappers/Signaling/UserMedia';
import { UserId } from '../wrappers/Signaling/User';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

interface useRTCPeerConnectionProps {
    lastJsonMessage: any;
    sendJsonMessage: SendJsonMessage;
}

export default function useRTCPeerConnection({
    sendJsonMessage,
    lastJsonMessage,
}: useRTCPeerConnectionProps) {
    const [RTCConnection, setRTCConnection] = useState<RTCPeerConnection>();

    const [localStream, setLocalStream] = useState<MediaStream>();

    const [remoteStreams, setRemoteStreams] = useState<readonly MediaStream[]>(
        []
    );

    const navigate = useNavigate();
    // Access Zustand Store

    // ! Look up if one change changes all
    const {
        offerMsg,
        target,
        setRTCConnectionState,
        resetRTCConnectionSlice,
        callOptions,
    } = useZustandStore((state) => {
        return {
            offerMsg: state.offerMsg,
            target: state.target,
            setRTCConnectionState: state.setRTCConnectionState,
            resetRTCConnectionSlice: state.resetRTCConnectionSlice,
            callOptions: state.callOptions,
        };
    });

    const callPartner = useMemo(() => {
        return target || offerMsg?.origin;
    }, [target, offerMsg]);

    const createPeerConnection = useCallback(async (callPartner: UserId) => {
        const newRTCPeerConnection = new RTCPeerConnection();
        // Required Event Handlers
        newRTCPeerConnection.onicecandidate = buildOnIceCandidateHandler(
            callPartner,
            sendJsonMessage
        );
        newRTCPeerConnection.ontrack = buildOnTrackHandler(setRemoteStreams);
        newRTCPeerConnection.onnegotiationneeded = buildOnNegationNeededHandler(
            callPartner,
            sendJsonMessage,
            newRTCPeerConnection
        );
        // Optional Event Handlers
        newRTCPeerConnection.oniceconnectionstatechange =
            buildOnIceConnectionStateChangeHandler(newRTCPeerConnection);
        newRTCPeerConnection.onicegatheringstatechange =
            buildOnIceGatheringStateChangeHandler();
        setRTCConnection(newRTCPeerConnection);
    }, []);

    const startPassiveCall = useCallback(async () => {
        if (!RTCConnection) {
            return;
        }
        if (!offerMsg) {
            console.error('called passive call w/o incoming call');
            return;
        }
        const { origin, body: { desc } = {} } = offerMsg;
        if (!origin) {
            console.error('Missing origin in socket message');
            return;
        }
        if (!desc) {
            console.error('Missing sdp in message body');
            return;
        }

        console.log('Entering passive call');
        try {
            await RTCConnection.setRemoteDescription(desc);

            const newLocalStream = (await getUserMedia(
                callOptions
            )) as MediaStream;

            setLocalStream(newLocalStream);

            newLocalStream.getTracks().forEach((track) => {
                RTCConnection.addTrack(track, newLocalStream);
            });

            const answer = await RTCConnection.createAnswer();
            await RTCConnection.setLocalDescription(answer);

            const answerDesc = RTCConnection.localDescription;
            if (!answerDesc) {
                throw 'no local answer';
            }
            const msg = createSDPMessage('call-answer', origin, answerDesc);
            sendJsonMessage(msg);
        } catch (error) {
            // notify caller that RTC failed
            const msg = createHangUpMessage(origin);
            sendJsonMessage(msg);
            // give user error feedback
            getUserMediaErrorHandler(error);
            // Go back to call & execute cleanup
            navigate('/call');
        }
    }, [RTCConnection]);

    const startActiveCall = useCallback(async () => {
        if (!RTCConnection) {
            return;
        }
        try {
            const newLocalStream = (await getUserMedia(
                callOptions
            )) as MediaStream;
            setLocalStream(newLocalStream);

            // attach the new LocalStream to the RTCConnection
            newLocalStream.getTracks().forEach((track) => {
                RTCConnection.addTrack(track, newLocalStream);
            });
        } catch (error) {
            //* No HangUp needed because no message sent yet
            // give user error feedback
            getUserMediaErrorHandler(error);
            // Go back to call & execute cleanup
            navigate('/call');
        }
    }, [RTCConnection]);

    const closeRTCConnection = useCallback(async () => {
        if (!RTCConnection) {
            return;
        }
        // Required Event Handlers
        RTCConnection.onicecandidate = null;
        RTCConnection.ontrack = null;
        RTCConnection.onnegotiationneeded = null;
        // Optional Event Handlers
        RTCConnection.oniceconnectionstatechange = null;
        RTCConnection.onicegatheringstatechange = null;

        RTCConnection.close();

        setRTCConnection(undefined);
    }, [RTCConnection]);

    async function closeLocalStream() {
        if (!localStream) {
            return;
        }
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(undefined);
    }

    const closeCall = useCallback(async () => {
        // stop sending media
        closeRTCConnection();
        // stop recording media
        closeLocalStream();
        // reset zustand values
        resetRTCConnectionSlice();
    }, [RTCConnection, localStream, resetRTCConnectionSlice]);

    //* Effect to establish a new video call
    useEffect(() => {
        // Invalid Page Traversal
        if (!callPartner) {
            navigate('/call');
            return;
        }

        createPeerConnection(callPartner);

        return () => {
            closeRTCConnection();
        };
    }, []);

    // * Deciding wether incoming call or outgoing call
    useEffect(() => {
        if (!RTCConnection) {
            return;
        }
        setRTCConnectionState(true);
        console.log('stated RTCConnection is active');
        // User is getting called
        if (offerMsg) {
            // ICT of Caller already checked
            // Provide Callee ICT
            startPassiveCall();
        }

        // User is calling somebody
        if (target) {
            // Check Callee ICT
            // Provide Caller ICT
            startActiveCall();
        }

        return () => {
            if (!callPartner) {
                return;
            }
            const answerMsg = createHangUpMessage(callPartner);
            sendJsonMessage(answerMsg);
        };
    }, [RTCConnection]);

    // * Effect for Incoming Socket Message
    useEffect(() => {
        // Listen only after RTCPeer is active
        if (!lastJsonMessage) {
            return;
        }
        const { type } = lastJsonMessage as Message;
        // Missing type --> not a message --> error
        if (!type) {
            console.error('Missing socket message type');
            return;
        }
        // Handle RTC-Type Socket Messages
        switch (type) {
            case 'call-offer':
                incomingOfferHandler(lastJsonMessage);
                break;
            case 'call-answer':
                incomingAnswerHandler(lastJsonMessage, RTCConnection);
                break;
            case 'new-icecandidate':
                incomingIceCandidateHandler(lastJsonMessage, RTCConnection);
                break;
            case 'hang-up':
                if (validateHangUp(lastJsonMessage, callPartner)) {
                    navigate('/call');
                }
        }
    }, [lastJsonMessage]);

    return { localStream, remoteStreams, closeCall };
}
