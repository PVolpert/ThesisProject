export {};
// import { useEffect, useMemo, useState } from 'react';
// import { useStore } from '../store/Store';
// import {
//     Message,
//     WebRTCMessage,
//     createHangUpMessage,
//     createSDPMessage,
// } from '../helpers/Signaling/Messages';
// import { useNavigate } from 'react-router-dom';
// import {
//     validateHangUp,
//     incomingOfferHandler,
// } from '../helpers/Signaling/MessageHandlers';
// import {
//     getUserMedia,
//     getUserMediaErrorHandler,
// } from '../helpers/WebRTCPhase/UserMedia';

// import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
// import { UserId } from '../helpers/Signaling/User';

// interface useRTCPeerConnectionProps {
//     lastJsonMessage: any;
//     sendJsonMessage: SendJsonMessage;
// }

// export default function useRTCPeerConnection({
//     sendJsonMessage,
//     lastJsonMessage,
// }: useRTCPeerConnectionProps) {
//     const [RTCConnection] = useState<RTCPeerConnection>(
//         new RTCPeerConnection()
//     );
//     const [localStream, setLocalStream] = useState<MediaStream>(
//         new MediaStream()
//     );
//     const [remoteStreams, setRemoteStreams] = useState<readonly MediaStream[]>(
//         []
//     );
//     const [isDescriptionReady, setIsDescriptionReady] = useState(false);
//     const [isICTready, setIsICTready] = useState(false);

//     const navigate = useNavigate();

//     //  ###### Store Imports #########

//     const accessToken = useStore((state) => state.accessToken);

//     const setOfferState = useStore((state) => state.setOfferLoadState);
//     const setOfferICTState = useStore((state) => state.setICTOfferLoadState);
//     const setOfferSendState = useStore((state) => state.setOfferSendLoadState);
//     const setAnswerReceivedLoadState = useStore(
//         (state) => state.setAnswerReceivedLoadState
//     );

//     const acceptAnswer = useStore((state) => state.acceptAnswer);
//     const setAnswerLoadState = useStore((state) => state.setAnswerLoadState);
//     const setICTAnswerLoadState = useStore(
//         (state) => state.setICTAnswerLoadState
//     );
//     const setAnswerSentLoadState = useStore(
//         (state) => state.setAnswerSentLoadState
//     );

//     const incomingOffer = useStore((state) => state.incomingOffer);
//     const incomingAnswer = useStore((state) => state.incomingAnswer);
//     const setIncomingAnswer = useStore((state) => state.setIncomingAnswer);
//     const callPartner = useStore((state) => state.callPartner);
//     const setShouldBlockOutsideOffers = useStore(
//         (state) => state.setShouldBlockOutsideOffers
//     );
//     const callSettings = useStore((state) => state.callSettings);

//     // ##### General Functions #####

//     function appendEventHandlers() {
//         // Required Event Handlers
//         RTCConnection.onnegotiationneeded = () => {
//             RTCConnection.createOffer().then((offer) => {
//                 RTCConnection.setLocalDescription(offer);
//             });
//         };
//         RTCConnection.onicecandidate = (ev) => {
//             let candidate = ev.candidate;
//             // Empty candidate shows no more candidates
//             if (!candidate) {
//                 setIsDescriptionReady(true);
//                 !incomingOffer
//                     ? setOfferState('fulfilled')
//                     : setAnswerLoadState('fulfilled');
//             }
//         };

//         RTCConnection.ontrack = (event: RTCTrackEvent) => {
//             setRemoteStreams(event.streams);
//         };
//     }

//     async function addLocalStreamTracksToRTCConnectionTracks() {
//         try {
//             const newLocalStream = (await getUserMedia(
//                 callSettings
//             )) as MediaStream;
//             // attach the new LocalStream to the RTCConnection
//             newLocalStream.getTracks().forEach((track) => {
//                 RTCConnection.addTrack(track, localStream);
//             });

//             setLocalStream(newLocalStream);
//         } catch (error) {
//             console.error(error);
//             throw error;
//         }
//     }

//     async function doICTPromise(callPartner: UserId) {
//         // // TODO Add PoP
//         // try {
//         //     // Notify store here
//         //     // TODO Add incoming call storage
//         //     setIsICTready(true);
//         //     !incomingOffer
//         //         ? setOfferICTState('fulfilled')
//         //         : setICTAnswerLoadState('fulfilled');
//         //     return icts;
//         // } catch (error) {
//         //     // setOutgoingCallProcessICT('failed');
//         //     throw Error('ict acquisition failed');
//         // }
//     }

//     // #### Passive Call Functions #####

//     const startPassiveCall = async (
//         newRemoteDescription: RTCSessionDescription
//     ) => {
//         try {
//             await RTCConnection.setRemoteDescription(newRemoteDescription);

//             // ? This might be done outside
//             await addLocalStreamTracksToRTCConnectionTracks();

//             const answer = await RTCConnection.createAnswer();
//             await RTCConnection.setLocalDescription(answer);
//         } catch (error) {
//             console.log(error);
//             // give user error feedback
//             getUserMediaErrorHandler(error);
//             // Go back to call & execute cleanup
//             navigate('/call');
//         }
//     };

//     // ################## Active Call Functions #################

//     async function startActiveCall() {
//         try {
//             await addLocalStreamTracksToRTCConnectionTracks();
//         } catch (error) {
//             console.log(error);
//             // give user error feedback
//             getUserMediaErrorHandler(error);
//             // Go back to call & execute cleanup
//             navigate('/call');
//         }
//     }

//     // #################### Closing Functions #####################

//     async function closeCall() {
//         //Null all event handlers
//         RTCConnection.onicecandidate = null;
//         RTCConnection.ontrack = null;
//         RTCConnection.onnegotiationneeded = null;
//         //Close the connection
//         // RTCConnection.close();

//         localStream.getTracks().forEach((track) => track.stop());
//     }

//     //################ Side Effects #########################

//     //* Effect to establish a new video call
//     useEffect(() => {
//         if (!accessToken) {
//             return;
//         }
//         if (!callPartner) {
//             // Invalid Page Traversal
//             navigate('/call');
//             return () => {
//                 setShouldBlockOutsideOffers(false);
//             };
//         }

//         try {
//             setShouldBlockOutsideOffers(true);

//             appendEventHandlers();

//             doICTPromise(callPartner);
//             //Block other users from calling
//             if (incomingOffer) {
//                 startPassiveCall(incomingOffer);
//             }

//             startActiveCall();
//         } catch (error) {
//             // TODO handle errors about offer here
//             // Check if error is from ict or WebRTC
//             // Handle individual error
//         }

//         return () => {
//             setShouldBlockOutsideOffers(false);
//             closeCall();
//         };
//     }, []);

//     // SideEffect for sending messages when ICT is loaded
//     useEffect(() => {
//         // ? Might append asymmetric key here
//         if (!isDescriptionReady || !isICTready || !callPartner) {
//             return;
//         }

//         const desc = RTCConnection.localDescription;

//         if (!desc) {
//             throw Error('Invalid local Description');
//         }
//         // TODO: Create JWT here

//         switch (desc.type) {
//             case 'offer': {
//                 const msg = createSDPMessage('call-offer', callPartner, desc);
//                 sendJsonMessage(msg);
//                 setOfferSendState('fulfilled');

//                 break;
//             }
//             case 'answer': {
//                 const msg = createSDPMessage('call-answer', callPartner, desc);
//                 sendJsonMessage(msg);
//                 setAnswerSentLoadState('fulfilled');
//                 break;
//             }
//         }

//         return () => {
//             if (!callPartner) {
//                 return;
//             }
//             const answerMsg = createHangUpMessage(callPartner);
//             sendJsonMessage(answerMsg);
//         };
//     }, [isDescriptionReady, isICTready]);

//     useEffect(() => {
//         if (!accessToken || acceptAnswer != 'fulfilled' || !incomingAnswer) {
//             return;
//         }

//         RTCConnection.setRemoteDescription(incomingAnswer);
//     }, [incomingAnswer, acceptAnswer]);

//     // * Effect for Incoming Socket Message
//     useEffect(() => {
//         // Listen only after RTCPeer is active
//         if (!lastJsonMessage) {
//             return;
//         }
//         const { type } = lastJsonMessage as Message;
//         // Missing type --> not a message --> error
//         if (!type) {
//             console.error('Missing socket message type');
//             return;
//         } // Handle RTC-Type Socket Messages
//         switch (type) {
//             case 'call-offer':
//                 incomingOfferHandler(lastJsonMessage);
//                 break;
//             case 'call-answer':
//                 try {
//                     const { origin, body: { desc } = {} } =
//                         lastJsonMessage as WebRTCMessage;
//                     if (!origin) {
//                         console.error('sdp Message is missing origin');
//                         return;
//                     }
//                     if (!desc) {
//                         console.error('sdp Message is missing body');
//                         return;
//                     }
//                     // TODO validate ICT here

//                     setIncomingAnswer(desc);
//                     setAnswerReceivedLoadState('fulfilled');
//                 } catch (error) {
//                     console.log(error);
//                 }
//                 break;
//             case 'hang-up':
//                 if (validateHangUp(lastJsonMessage, callPartner)) {
//                     navigate('/call');
//                 }
//         }
//     }, [lastJsonMessage]);

//     return { localStream, remoteStreams, closeCall };
// }
