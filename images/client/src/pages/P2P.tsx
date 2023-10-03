// import { useEffect, useMemo, useRef, useState } from 'react';

// import { useToken } from '../hooks/useToken';
// import useSignaling from '../hooks/useSignaling';
// import { EventID } from '../helpers/ICTPhase/Events';
// import {
//     isSendCandidatesMessageEvent,
//     isSendICTMessageEvent,
//     isSendNotifyMessageEvent,
//     isSendOPNMessageEvent,
//     isVerifyEvent,
// } from '../helpers/ICTPhase/EventCheckers';
// import {
//     createCallAnswerMessage,
//     createCallOfferMessage,
//     createConferenceOfferMessage,
//     createConfirmationOfferMessage,
//     createICTAnswerMessage,
//     createICTOfferMessage,
//     createICTTransferMessage,
//     createPeerOPNMessage,
// } from '../helpers/Signaling/Messages';
// import { ICTPhaseGroup } from '../helpers/ICTPhase/ICTPhase';
// import {
//     UserId,
//     stringToUserId,
//     userIdToString,
// } from '../helpers/Signaling/User';
// import { useStore } from '../store/Store';
// import { useNavigate } from 'react-router-dom';
// import {
//     isCandidatesMessage,
//     isICTMessage,
//     isIncomingMessage,
//     isOPNMessage,
//     isOriginMessage,
// } from '../helpers/Signaling/MessageChecker';
import Page from '../components/UI/Page';

// import { ictProviders } from '../helpers/Auth/OIDCProviderInfo';
// import OIDCProvider from '../helpers/Auth/OIDCProvider';

// import CallerICT from '../components/P2P/verification/CallerICT';
import { Description } from '../components/UI/Headers';
// import Video from '../components/Video/Video';
import Button from '../components/UI/Button';

// let ictPhase = new ICTPhaseGroup<string>();

// type ictDisplayPhases =
//     | 'waitAnswer'
//     | 'verifyCaller'
//     | 'verifyCaller'
//     | 'waitResponse'
//     | 'ICTCaller';

export default function P2PPage() {
    // const [ictDisplayPhase, setIctDisplayPhase] =
    //     useState<ictDisplayPhases>('waitAnswer');

    // const { accessToken, signalingUrl } = useToken({ needsToken: true });
    // const {
    //     socket: { sendJsonMessage, lastJsonMessage },
    // } = useSignaling({ socketUrl: signalingUrl });

    // const activeUsers = useStore((state) => state.activeUsers);

    // const caller = useStore((state) => state.caller);
    // const trustedOpenIDProviders = useStore(
    //     (state) => state.trustedOpenIDProviders
    // );
    // const candidates = useStore((state) => state.candidates);
    // const navigate = useNavigate();

    // const mode = useMemo(() => {
    //     if (!!caller && trustedOpenIDProviders.length > 0) {
    //         return 'passive';
    //     }
    //     if (candidates.length === 1) {
    //         return 'active';
    //     }
    // }, [caller, trustedOpenIDProviders, candidates]);

    // useEffect(() => {
    //     if (!mode) {
    //         // navigate('/call');
    //         return;
    //     }

    //     attachEventListeners(ictPhase);

    //     if (mode === 'active') {
    //         console.log('Starting active Call');
    //         const target: UserId = {
    //             issuer: candidates[0].issuer,
    //             subject: candidates[0].subject,
    //         };
    //         ictPhase.startCall(userIdToString(target));
    //     }
    //     if (mode === 'passive') {
    //         console.log('Starting passive Call');
    //         ictPhase.receiveCall(
    //             userIdToString(caller as UserId),
    //             trustedOpenIDProviders
    //         );
    //     }
    //     return () => {
    //         console.log('Resetting ICT-Phase');
    //         ictPhase = new ICTPhaseGroup<string>();
    //     };
    // }, []);

    // function attachEventListeners(ictPhase: ICTPhaseGroup<string>) {
    //     console.log('Attaching Event Listeners for ICTPhase');
    //     ictPhase.addEventListener(EventID.notify, (e: Event) => {
    //         if (!isSendNotifyMessageEvent<string>(e)) throw new Error();

    //         const {
    //             detail: { target, time, type },
    //         } = e;
    //         switch (type) {
    //             case 'Call-Offer':
    //                 console.log(`Sending Call-Offer at ${time}`);
    //                 sendJsonMessage(
    //                     createCallOfferMessage(stringToUserId(target))
    //                 );
    //                 break;
    //             case 'Conference-Offer':
    //                 console.log(`Sending Conference-Offer at ${time}`);
    //                 sendJsonMessage(
    //                     createConferenceOfferMessage(stringToUserId(target))
    //                 );
    //                 break;
    //             case 'Confirmation':
    //                 console.log(`Sending Confirmation at ${time}`);
    //                 sendJsonMessage(
    //                     createConfirmationOfferMessage(stringToUserId(target))
    //                 );
    //                 break;
    //         }
    //     });
    //     ictPhase.addEventListener(EventID.sendOPNMessage, (e: Event) => {
    //         if (!isSendOPNMessageEvent<string>(e)) throw new Error();

    //         const {
    //             detail: { target, time, type, OPNMap },
    //         } = e;
    //         switch (type) {
    //             case 'Call-Answer': {
    //                 console.log(`Sending Call-Answer at ${time}`);
    //                 const transportableOPNMap = Object.fromEntries(OPNMap);

    //                 sendJsonMessage(
    //                     createCallAnswerMessage(
    //                         stringToUserId(target),
    //                         transportableOPNMap
    //                     )
    //                 );
    //                 break;
    //             }
    //             case 'Peer-OPN': {
    //                 console.log(`Sending Peer-Transfer at ${time}`);
    //                 const transportableOPNMap = Object.fromEntries(OPNMap);
    //                 sendJsonMessage(
    //                     createPeerOPNMessage(
    //                         stringToUserId(target),
    //                         transportableOPNMap
    //                     )
    //                 );
    //                 break;
    //             }
    //         }
    //     });
    //     ictPhase.addEventListener(EventID.sendICTMessage, (e: Event) => {
    //         if (!isSendICTMessageEvent<string>(e)) throw new Error();

    //         const {
    //             detail: { target, time, type, jwt },
    //         } = e;
    //         switch (type) {
    //             case 'ICT-Offer':
    //                 console.log(`Sending ICT-Offer at ${time}`);
    //                 sendJsonMessage(
    //                     createICTOfferMessage(stringToUserId(target), jwt)
    //                 );
    //                 break;
    //             case 'ICT-Answer':
    //                 console.log(`Sending ICT-Answer at ${time}`);
    //                 sendJsonMessage(
    //                     createICTAnswerMessage(stringToUserId(target), jwt)
    //                 );
    //                 break;
    //             case 'ICT-Transfer':
    //                 console.log(`Sending ICT-Transfer at ${time}`);
    //                 sendJsonMessage(
    //                     createICTTransferMessage(stringToUserId(target), jwt)
    //                 );

    //                 break;
    //         }
    //     });
    //     ictPhase.addEventListener(EventID.sendCandidates, (e: Event) => {
    //         if (!isSendCandidatesMessageEvent<string>(e)) throw new Error();

    //         const {
    //             detail: { target, time, candidateIDs },
    //         } = e;
    //         console.log(`Sending ICT-Answer at ${time}`);
    //     });
    //     ictPhase.addEventListener(EventID.verify, (e: Event) => {
    //         if (!isVerifyEvent<string>(e)) throw new Error();

    //         const {
    //             detail: { time, type, candidates },
    //         } = e;
    //         switch (type) {
    //             case 'OPN':
    //                 console.log(`Starting OPN Verification at ${time}`);

    //                 break;
    //             case 'Caller':
    //                 console.log(`Starting Caller Authentication at ${time}`);

    //                 break;
    //             case 'Callees':
    //                 console.log(`Starting Callees Authentication at ${time}`);

    //                 break;
    //             case 'Peer-OPN':
    //                 console.log(`Starting Peer-OPN Verification at ${time}`);

    //                 break;
    //             case 'Peers':
    //                 console.log(`Starting Peers Authentication at ${time}`);

    //                 break;
    //         }
    //     });
    // }

    // // Local Signaling Handler
    // useEffect(() => {
    //     if (
    //         !lastJsonMessage ||
    //         !isIncomingMessage(lastJsonMessage) ||
    //         !isOriginMessage(lastJsonMessage)
    //     ) {
    //         return;
    //     }

    //     const { type, origin } = lastJsonMessage;

    //     //? Might want to handle errors with try catch
    //     //? Errors that are caused by calling the function to soon could be remedied
    //     switch (type) {
    //         case 'Call-Answer': {
    //             if (!isOPNMessage(lastJsonMessage)) return;
    //             console.log(`Incoming call-answer message at ${Date.now()}`);
    //             console.log(lastJsonMessage);
    //             const {
    //                 body: { OPNMap: transportableOPNMap },
    //             } = lastJsonMessage;

    //             ictPhase.setCallAnswer(
    //                 userIdToString(origin),
    //                 new Map<string, string>(Object.entries(transportableOPNMap))
    //             );
    //             break;
    //         }
    //         case 'Peer-OPN': {
    //             if (!isOPNMessage(lastJsonMessage)) return;
    //             console.log(`Incoming Peer-OPN message at ${Date.now()}`);
    //             const {
    //                 body: { OPNMap: transportableOPNMap },
    //             } = lastJsonMessage;
    //             ictPhase.setPeerOPN(
    //                 userIdToString(origin),
    //                 new Map<string, string>(Object.entries(transportableOPNMap))
    //             );
    //             break;
    //         }
    //         case 'ICT-Offer': {
    //             if (!isICTMessage(lastJsonMessage)) return;
    //             console.log(`Incoming ICT-Offer message at ${Date.now()}`);
    //             const {
    //                 body: { jwt },
    //             } = lastJsonMessage;
    //             ictPhase.setICTOffer(userIdToString(origin), jwt);
    //             break;
    //         }
    //         case 'ICT-Answer': {
    //             if (!isICTMessage(lastJsonMessage)) return;
    //             console.log(`Incoming ICT-Answer message at ${Date.now()}`);
    //             const {
    //                 body: { jwt },
    //             } = lastJsonMessage;
    //             ictPhase.setICTAnswer(userIdToString(origin), jwt);
    //             break;
    //         }
    //         case 'ICT-Transfer': {
    //             if (!isICTMessage(lastJsonMessage)) return;
    //             console.log(`Incoming ICT-Transfer message at ${Date.now()}`);
    //             const {
    //                 body: { jwt },
    //             } = lastJsonMessage;
    //             ictPhase.setICTTransfer(userIdToString(origin), jwt);
    //             break;
    //         }
    //         case 'Candidates': {
    //             if (!isCandidatesMessage(lastJsonMessage)) return;
    //             console.log(`Incoming Candidates message at ${Date.now()}`);
    //             const {
    //                 body: { candidateIDs },
    //             } = lastJsonMessage;
    //             ictPhase.setCandidates(
    //                 userIdToString(origin),
    //                 candidateIDs.map(userIdToString)
    //             );
    //             break;
    //         }

    //         case 'Confirmation':
    //             console.log(`Incoming Confirmation message at ${Date.now()}`);
    //             ictPhase.setConfirmation(userIdToString(origin));
    //             break;
    //     }
    // }, [lastJsonMessage]);

    // const ictTokenSets = useStore((state) => state.ictTokenSets);
    // const dummyUserA = 'hopper';
    // const dummyUserB = 'vonneumann';
    // const dummyOPN = new Map([
    //     [ictProviders[0].info.issuer.href, '1'],
    //     [ictProviders[2].info.issuer.href, '1'],
    // ]);
    // const dummyOPN2 = new Map([[ictProviders[2].info.issuer.href, '1']]);
    // // const filteredICTTokenSet = ;
    // const b = useMemo(() => {
    //     return getProviderAndTokenFromOPN(dummyOPN);
    // }, [ictTokenSets, ictProviders, dummyOPN]);
    // const c = useMemo(() => {
    //     return getProviderAndTokenFromOPN(dummyOPN2);
    // }, [ictTokenSets, ictProviders, dummyOPN]);

    // const dummyCandidates = new Map([
    //     [dummyUserA, b],
    //     [dummyUserB, c],
    // ]);

    // function getProviderAndTokenFromOPN(OPN: Map<string, string>) {
    //     return [...OPN.keys()].map((opnIssuer) => {
    //         const oidcProvider = ictProviders.find((provider) => {
    //             return provider.info.issuer.href === opnIssuer;
    //         }) as OIDCProvider;
    //         const tokenSet = ictTokenSets.find((tokenSet) => {
    //             return tokenSet.idToken.iss === opnIssuer;
    //         });
    //         return { oidcProvider, tokenSet };
    //     });
    // }

    // const videoDummy = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

    // const localRef = useRef<HTMLVideoElement>(null);
    // const remoteRef = useRef<HTMLVideoElement>(null);
    // return <P2PDisplay localRef={localRef} remoteRef={remoteRef} />;

    return (
        <Page>
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <video poster="/grace_hopper.jpg"></video>
                    <Description>Grace Hopper (ICT-Alpha)</Description>
                </div>
                <div>
                    <video poster="/john_von_neumann.png"></video>
                    <Description>John von Neumann (ICT-Beta)</Description>
                </div>
            </div>
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 flex space-x-2 mb-3">
                <Button className="justify-center flex  bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050">
                    Hang Up
                </Button>
                <Button className="justify-center flex   bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050">
                    Renegotiate
                </Button>
                <Button className="justify-center flex  bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050">
                    {' '}
                    Add User
                </Button>
            </div>

            <div className="absolute right-0 bottom-0 m-3">
                <video width={300} poster="/alan-turing.jpg"></video>
                <Description>Yourself (Alan Turing (ICT-Gamma))</Description>
            </div>
        </Page>
    );
}
