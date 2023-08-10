import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store/Store';
import {
    Message,
    createHangUpMessage,
    createSDPMessage,
} from '../helpers/Signaling/Messages';
import { useNavigate } from 'react-router-dom';
import {
    incomingAnswerHandler,
    validateHangUp,
    incomingIceCandidateHandler,
    incomingOfferHandler,
} from '../helpers/Signaling/MessageHandlers';
import {
    getUserMedia,
    getUserMediaErrorHandler,
} from '../helpers/WebRTC/UserMedia';

import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { requestICTs } from '../helpers/ICT/ICT';
import { UserId } from '../helpers/Signaling/User';

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

    const setOutgoingCallProcessOffer = useStore(
        (state) => state.setOutgoingCallProcessOffer
    );
    const setOutgoingCallProcessICT = useStore(
        (state) => state.setOutgoingCallProcessICT
    );
    const setOutgoingCallProcessSendOffer = useStore(
        (state) => state.setOutgoingCallProcessSendOffer
    );
    const ictLoadState = useStore((state) => state.ictLoadState);
    const offerLoadState = useStore((state) => state.offerLoadState);
    const sendOfferLoadState = useStore((state) => state.sendOfferLoadState);

    const {
        offerMsg,
        callee,
        setRTCConnectionState: setHasActiveRTCConnection,
        resetRTCConnectionSlice,
        callOptions,
    } = useStore((state) => {
        return {
            offerMsg: state.offerMsg,
            callee: state.callee,
            setRTCConnectionState: state.setRTCConnectionState,
            resetRTCConnectionSlice: state.resetRTCConnectionSlice,
            callOptions: state.callSettings,
        };
    });

    const callPartner = useMemo(() => {
        return callee || offerMsg?.origin;
    }, [callee, offerMsg]);

    async function createNewRTCConnection() {
        const newRTCConnection = new RTCPeerConnection();
        // Required Event Handlers
        newRTCConnection.onnegotiationneeded = () => {
            newRTCConnection.createOffer().then((offer) => {
                newRTCConnection.setLocalDescription(offer);
            });
        };
        newRTCConnection.onicecandidate = (ev) => {
            let candidate = ev.candidate;
            // Empty candidate shows no more candidates
            if (!candidate) {
                setOutgoingCallProcessOffer('done');
            }
        };

        newRTCConnection.ontrack = (event: RTCTrackEvent) => {
            setRemoteStreams(event.streams);
        };

        setRTCConnection(newRTCConnection);
    }

    const startPassiveCall = async () => {
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
                throw Error('no local answer');
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
    };

// ################## Active Call Functions #################
    
    async function startActiveCall() {
        if (!RTCConnection || !callPartner) {
            return;
        }
        try {
            doICTPromise(callPartner);
            addNewLocalStreamToRTCConnection();
        } catch (error) {
            console.log(error);
            //* No HangUp needed because no message sent yet
            // give user error feedback
            getUserMediaErrorHandler(error);
            // Go back to call & execute cleanup
            navigate('/call');
        }
    }
    
    async function addNewLocalStreamToRTCConnection() {
        try {
            if (!RTCConnection) {
                throw Error('no rtc available');
            }
            // Request media from user
            const newLocalStream = (await getUserMedia(
                callOptions
            )) as MediaStream;
            setLocalStream(newLocalStream);

            // attach the new LocalStream to the RTCConnection
            newLocalStream.getTracks().forEach((track) => {
                RTCConnection.addTrack(track, newLocalStream);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function doICTPromise(callPartner: UserId) {
        try {
            const icts = requestICTs(callPartner);
            // Notify store here
            setOutgoingCallProcessICT('done');
            return icts;
        } catch (error) {
            setOutgoingCallProcessICT('failed');
            throw Error('ict acquisition failed');
        }
    }



// #################### Closing Functions #####################
    
    async function closeCall() {
        // stop recording media
        closeLocalStream();
        // stop sending media
        closeRTCConnection();
    }
    
    async function closeLocalStream() {
        if (!localStream) {
            //No need to close localStream if it does not exist
            return;
        }
        //Stop all media recording devices
        localStream.getTracks().forEach((track) => track.stop());
        //Drop the LocalStream from State
        setLocalStream(undefined);
    }

    async function closeRTCConnection() {
        if (!RTCConnection) {
            // No need to close the RTCConnection if does not exist
            return;
        }
        //Null all event handlers
        RTCConnection.onicecandidate = null;
        RTCConnection.ontrack = null;
        RTCConnection.onnegotiationneeded = null;
        //Close the connection
        RTCConnection.close();
        //Drop the RTCConnection from State
        setRTCConnection(undefined);
        //Reset store flag --> enable future calls
        resetRTCConnectionSlice();
    }

    //################ Side Effects #########################

    //* Effect to establish a new video call
    useEffect(() => {
        if (!callPartner) {
            // Invalid Page Traversal
            navigate('/call');
            return;
        }
        // Call is valid, so create a new RTCConnection
        createNewRTCConnection();
        // Notify
        setHasActiveRTCConnection(true);
    }, []);

    // * Deciding wether incoming call or outgoing call
    useEffect(() => {
        if (!RTCConnection) {
            return;
        }
        if (offerMsg) {
            startPassiveCall();
        }

        if (callee) {
            startActiveCall();
        }
    }, [RTCConnection]);

    useEffect(() => {
        if (
            offerLoadState != 'done' ||
            ictLoadState != 'done' ||
            !RTCConnection ||
            !callPartner
        ) {
            return;
        }

        const desc = RTCConnection.localDescription;

        if (!desc) {
            throw Error('Invalid local Description');
        }
        // TODO: Create JWT here

        const msg = createSDPMessage('call-offer', callPartner, desc);

        sendJsonMessage(msg);
        setOutgoingCallProcessSendOffer('done');

        return () => {
            if (!callPartner) {
                return;
            }
            const answerMsg = createHangUpMessage(callPartner);
            sendJsonMessage(answerMsg);
        };
    }, [offerLoadState, ictLoadState]);

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
