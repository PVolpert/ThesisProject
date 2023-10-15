import { useEffect, useMemo, useRef, useState } from 'react';

import { useToken } from '../hooks/useToken';
import useSignaling from '../hooks/useSignaling';
import { EventID } from '../helpers/ICTPhase/Events';
import {
    isSendCandidatesMessageEvent,
    isSendICTMessageEvent,
    isSendNotifyMessageEvent,
    isSendOPNMessageEvent,
    isVerifyEvent,
} from '../helpers/ICTPhase/EventCheckers';
import {
    createCallAnswerMessage,
    createCallOfferMessage,
    createCandidatesMessage,
    createConferenceOfferMessage,
    createConfirmationOfferMessage,
    createICTAnswerMessage,
    createICTOfferMessage,
    createICTTransferMessage,
    createPeerOPNMessage,
} from '../helpers/Signaling/Messages';
import { Candidate, ICTPhaseGroup } from '../helpers/ICTPhase/ICTPhase';
import {
    UserId,
    stringToUserId,
    userIdToString,
} from '../helpers/Signaling/User';
import { useStore } from '../store/Store';
import { useNavigate } from 'react-router-dom';

import { TokenSet } from '../store/slices/ICTAccessTokenSlice';
import { signalingMessageHandler } from '../helpers/Signaling/MessageHandlers';

import P2PDisplay from '../components/P2P/P2PDisplay';
import { ICTProviderInfo } from '../helpers/ICTPhase/OpenIDProvider';

let ictPhase = new ICTPhaseGroup<string>();

export type ictDisplayPhases =
    | 'waitForCallAnswer'
    | 'waitForICTOffer'
    | 'waitForICTAnswer'
    | 'verifyCallerIdentityAndCreateICTAnswer'
    | 'verifyCalleeIdentity'
    | 'verifyOPNAndCreateICTOffer';

export default function P2PPage() {
    const [ictDisplayPhase, setIctDisplayPhase] =
        useState<ictDisplayPhases>('waitForCallAnswer');

    const { signalingUrl } = useToken({ needsToken: true });
    const {
        socket: { sendJsonMessage, lastJsonMessage },
    } = useSignaling({ socketUrl: signalingUrl });

    const caller = useStore((state) => state.caller);
    const trustedOpenIDProviders = useStore(
        (state) => state.trustedOpenIDProviders
    );
    const candidates = useStore((state) => state.candidates);
    const navigate = useNavigate();

    const [verifyOPNCandidates, setVerifyOPNCandidates] = useState<
        Map<string, Candidate>
    >(new Map());
    const [
        verifyCallerIdentityAndCreateICTAnswerCandidates,
        setVerifyCallerIdentityAndCreateICTAnswerCandidates,
    ] = useState<Map<string, Candidate>>(new Map());
    const [verifyCalleeIdentityCandidates, setVerifyCalleeIdentityCandidates] =
        useState<Map<string, Candidate>>(new Map());

    const mode = useMemo(() => {
        if (!!caller && trustedOpenIDProviders.length > 0) {
            return 'passive';
        }
        if (candidates.length === 1) {
            return 'active';
        }
    }, [caller, trustedOpenIDProviders, candidates]);

    useEffect(() => {
        if (!mode) {
            // navigate('/call');
            return;
        }

        attachEventListeners(ictPhase);

        if (mode === 'active') {
            console.log('Starting active Call');

            ictPhase.startCall(userIdToString(candidates[0]));
        }
        if (mode === 'passive') {
            console.log('Starting passive Call');
            ictPhase.receiveCall(
                userIdToString(caller as UserId),
                trustedOpenIDProviders
            );
        }
        return () => {
            console.log('Resetting ICT-Phase');
            ictPhase = new ICTPhaseGroup<string>();
        };
    }, []);

    function attachEventListeners(ictPhase: ICTPhaseGroup<string>) {
        console.log('Attaching Event Listeners for ICTPhase');
        ictPhase.addEventListener(EventID.notify, async (e: Event) => {
            if (!isSendNotifyMessageEvent<string>(e)) throw new Error();

            const {
                detail: { target, time, type },
            } = e;
            switch (type) {
                case 'Call-Offer':
                    console.log(`Sending Call-Offer at ${time}`);
                    sendJsonMessage(
                        createCallOfferMessage(stringToUserId(target))
                    );
                    break;
                case 'Conference-Offer':
                    console.log(`Sending Conference-Offer at ${time}`);
                    sendJsonMessage(
                        createConferenceOfferMessage(stringToUserId(target))
                    );
                    break;
                case 'Confirmation':
                    console.log(`Sending Confirmation at ${time}`);
                    sendJsonMessage(
                        createConfirmationOfferMessage(stringToUserId(target))
                    );
                    break;
            }
        });
        ictPhase.addEventListener(EventID.sendOPNMessage, async (e: Event) => {
            if (!isSendOPNMessageEvent<string>(e)) throw new Error();

            const {
                detail: { target, time, type, OPNMap },
            } = e;
            switch (type) {
                case 'Call-Answer': {
                    console.log(`Sending Call-Answer at ${time}`);
                    const transportableOPNMap = Object.fromEntries(OPNMap);

                    sendJsonMessage(
                        createCallAnswerMessage(
                            stringToUserId(target),
                            transportableOPNMap
                        )
                    );
                    break;
                }
                case 'Peer-OPN': {
                    console.log(`Sending Peer-Transfer at ${time}`);
                    const transportableOPNMap = Object.fromEntries(OPNMap);
                    sendJsonMessage(
                        createPeerOPNMessage(
                            stringToUserId(target),
                            transportableOPNMap
                        )
                    );
                    break;
                }
            }
        });
        ictPhase.addEventListener(EventID.sendICTMessage, async (e: Event) => {
            if (!isSendICTMessageEvent<string>(e)) throw new Error();

            const {
                detail: { target, time, type, jwt },
            } = e;
            switch (type) {
                case 'ICT-Offer':
                    console.log(`Sending ICT-Offer at ${time}`);
                    sendJsonMessage(
                        createICTOfferMessage(stringToUserId(target), jwt)
                    );
                    break;
                case 'ICT-Answer':
                    console.log(`Sending ICT-Answer at ${time}`);
                    sendJsonMessage(
                        createICTAnswerMessage(stringToUserId(target), jwt)
                    );
                    break;
                case 'ICT-Transfer':
                    console.log(`Sending ICT-Transfer at ${time}`);
                    sendJsonMessage(
                        createICTTransferMessage(stringToUserId(target), jwt)
                    );

                    break;
            }
        });
        ictPhase.addEventListener(EventID.sendCandidates, async (e: Event) => {
            if (!isSendCandidatesMessageEvent<string>(e)) throw new Error();

            const {
                detail: { target, time, candidateIDs },
            } = e;
            console.log(`Sending ICT-Answer at ${time}`);
            sendJsonMessage(
                createCandidatesMessage(
                    stringToUserId(target),
                    candidateIDs.map(stringToUserId)
                )
            );
        });
        ictPhase.addEventListener(EventID.verify, async (e: Event) => {
            if (!isVerifyEvent<string>(e)) throw new Error();

            const {
                detail: { time, type, candidates },
            } = e;
            //? Peer to Peer can only have one entry

            switch (type) {
                case 'OPN': {
                    console.log(`Starting OPN Verification at ${time}`);
                    setVerifyOPNCandidates(new Map(candidates));
                    break;
                }
                case 'Caller': {
                    console.log(`Starting Caller Authentication at ${time}`);
                    setVerifyCallerIdentityAndCreateICTAnswerCandidates(
                        new Map(candidates)
                    );
                    break;
                }
                case 'Callees': {
                    console.log(`Starting Callees Authentication at ${time}`);

                    setVerifyCalleeIdentityCandidates(new Map(candidates));
                    break;
                }
                case 'Peer-OPN':
                    console.log(`Starting Peer-OPN Verification at ${time}`);

                    break;
                case 'Peers':
                    console.log(`Starting Peers Authentication at ${time}`);

                    break;
            }
        });
    }

    // useEffect for Verify States
    useEffect(() => {
        //   IF Call Answer Values

        if (
            ictDisplayPhase != 'waitForCallAnswer' ||
            verifyOPNCandidates.size === 0
        ) {
            return;
        }

        setIctDisplayPhase('verifyOPNAndCreateICTOffer');
    }, [verifyOPNCandidates, ictDisplayPhase]);
    useEffect(() => {
        if (
            ictDisplayPhase != 'waitForICTOffer' ||
            verifyCallerIdentityAndCreateICTAnswerCandidates.size === 0
        ) {
            return;
        }
        //   If Caller Verification
        setIctDisplayPhase('verifyCallerIdentityAndCreateICTAnswer');
    }, [verifyCallerIdentityAndCreateICTAnswerCandidates, ictDisplayPhase]);
    useEffect(() => {
        //   IF Callee Verification
        if (
            ictDisplayPhase != 'waitForICTAnswer' ||
            verifyCalleeIdentityCandidates.size === 0
        ) {
            return;
        }
        setIctDisplayPhase('verifyCalleeIdentity');
    }, [verifyCalleeIdentityCandidates, ictDisplayPhase]);

    // Local Signaling Handler
    useEffect(() => {
        signalingMessageHandler(lastJsonMessage, ictPhase);
    }, [lastJsonMessage]);

    const localRef = useRef<HTMLVideoElement>(null);
    const remoteRef = useRef<HTMLVideoElement>(null);

    function onYesHandlerCallerICTSelection(
        trustedOIDCProviders: ICTProviderInfo[],
        getICTParameters: {
            openIDProviderInfo: ICTProviderInfo;
            tokenSet: TokenSet;
            targets: string[];
        }[]
    ) {
        ictPhase.setCallerParameters(trustedOIDCProviders, getICTParameters);
    }
    function onYesHandlerVerifyCaller(
        oidcProvider: ICTProviderInfo,
        tokenSet: TokenSet,
        target: string
    ) {
        ictPhase.setCalleeParameters(oidcProvider, tokenSet, target);
    }

    function onNoHandler() {
        navigate('/call');
    }

    return (
        <P2PDisplay
            {...{
                localRef,
                remoteRef,
                ictDisplayPhase,
                onNoHandler,
                onYesHandlerCallerICTSelection,
                onYesHandlerVerifyCaller,
                verifyCalleeIdentityCandidates,
                verifyOPNCandidates,
                verifyCallerIdentityAndCreateICTAnswerCandidates,
            }}
        />
    );
}
