import { useEffect, useMemo, useRef, useState } from 'react';

import { useToken } from '../hooks/useToken';
import useSignaling from '../hooks/useSignaling';
import { EventID, EventID as ICTEventID } from '../helpers/ICTPhase/Events';
import {
    isSendCandidatesMessageEvent,
    isSendICTMessageEvent,
    isSendNotifyMessageEvent,
    isSendOPNMessageEvent,
    isTimedEvent,
    isVerifyEvent,
} from '../helpers/ICTPhase/EventCheckers';
import {
    createCallAnswerMessage,
    createCallOfferMessage,
    createCandidatesMessage,
    createConferenceOfferMessage,
    createConfirmationOfferMessage,
    createGroupLeaderPubKeyMessage,
    createICTAnswerMessage,
    createICTOfferMessage,
    createICTTransferMessage,
    createMemberPubKeyMessage,
    createPeerOPNMessage,
    createProducerIDMessage,
    createSharedSecretMessage,
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
import { SecretExchangePhase } from '../helpers/SecretExchangePhase/SecretExchangePhase';
import {
    sendSecretExchangeEventID,
    startSFUEventID,
} from '../helpers/SecretExchangePhase/Events';
import { isSendSecretExchangeEvent } from '../helpers/SecretExchangePhase/EventCheckers';
import {
    SFUPhaseGroupMember,
    SFUPhaseReceive,
} from '../helpers/SFUPhase/SFUPhase';
import {
    sendGetRequestWithAuthorization,
    sendPostRequestWithAuthorization,
} from '../helpers/SFUPhase/HTTP';
import {
    newMediaStreamEventID,
    sendProductIdEventId,
} from '../helpers/SFUPhase/Events';
import { isSendProductIdEvent } from '../helpers/SFUPhase/EventCheckers';

let ictPhase = new ICTPhaseGroup<string>();
let secretExchangePhase = new SecretExchangePhase<string>();
let sfuPhase = new SFUPhaseReceive<string>();

export type ictDisplayPhases =
    | 'start'
    | 'waitForCallAnswer'
    | 'waitForICTOffer'
    | 'waitForICTAnswer'
    | 'waitForCandidates'
    | 'waitForPeerOPN'
    | 'waitForPeerICTTransfer'
    | 'waitForConfirmations'
    | 'waitForOtherPeers'
    | 'waitForKeyExchange'
    | 'waitForConnectionStart'
    | 'verifyCallerIdentityAndCreateICTAnswer'
    | 'verifyCalleeIdentity'
    | 'verifyOPNAndCreateICTOffer'
    | 'verifyPeerOPN'
    | 'verifyPeerIdentity'
    | 'showStreams';

export default function P2PPage() {
    const [ictDisplayPhase, setIctDisplayPhase] =
        useState<ictDisplayPhases>('start');

    useEffect(() => {
        console.log(`Switching Display to ${ictDisplayPhase}`);
    }, [ictDisplayPhase]);

    const { signalingUrl, accessToken } = useToken({ needsToken: true });
    const {
        socket: { sendJsonMessage, lastJsonMessage },
    } = useSignaling({ socketUrl: signalingUrl });

    const caller = useStore((state) => state.caller);
    const type = useStore((state) => state.type);
    const trustedOpenIDProviders = useStore(
        (state) => state.trustedOpenIDProviders
    );
    const candidates = useStore((state) => state.candidates);
    const callSettings = useStore((state) => state.callSettings);
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

    const [verifyPeerOPNCandidates, setVerifyPeerOPNCandidates] = useState<
        Map<string, Candidate>
    >(new Map());

    const [sfuPhaseMembers, setSetsfuPhaseMembers] = useState<
        Map<string, SFUPhaseGroupMember>
    >(new Map());
    const [localStream, setLocalStream] = useState<MediaStream | undefined>();
    const [encryptedLocalStream, setEncryptedLocalStream] = useState<
        MediaStream | undefined
    >();

    const [verifyPeerIdentityCandidates, setVerifyPeerIdentityCandidates] =
        useState<Map<string, Candidate>>(new Map());

    const mode = useMemo(() => {
        if (!!caller && trustedOpenIDProviders.length > 0) {
            setIctDisplayPhase('waitForICTOffer');
            return 'passive';
        }
        if (candidates.length > 1) {
            setIctDisplayPhase('waitForCallAnswer');
            return 'active';
        }
        console.log('no candidates were found', candidates);
    }, []);

    useEffect(() => {
        if (!mode) {
            resetObjects();
            navigate('/call');

            return;
        }

        attachICTPhaseEventListeners();
        attachSecretExchangePhaseEventListeners();
        attachSFUPhaseEventListeners();

        if (mode === 'active') {
            console.log('Starting active Call');

            if (type === 'call') {
                ictPhase.startCall(userIdToString(candidates[0]));
            } else {
                ictPhase.startConference(candidates.map(userIdToString));
            }
        }
        if (mode === 'passive') {
            console.log('Starting passive Call');
            ictPhase.receiveCall(
                userIdToString(caller as UserId),
                trustedOpenIDProviders
            );
        }
        return () => {
            resetObjects();
        };
    }, []);

    function attachICTPhaseEventListeners() {
        console.log('Attaching Event Listeners for ICTPhase');
        ictPhase.addEventListener(ICTEventID.notify, async (e: Event) => {
            if (!isSendNotifyMessageEvent<string>(e)) throw new Error();

            const {
                detail: { target, time, type },
            } = e;
            switch (type) {
                case 'Call-Offer':
                    console.log(`Sending Call-Offer at ${time} to ${target}`);
                    sendJsonMessage(
                        createCallOfferMessage(stringToUserId(target))
                    );
                    break;
                case 'Conference-Offer':
                    console.log(
                        `Sending Conference-Offer at ${time} to ${target}`
                    );
                    sendJsonMessage(
                        createConferenceOfferMessage(stringToUserId(target))
                    );
                    break;
                case 'Confirmation':
                    console.log(`Sending Confirmation at ${time} to ${target}`);
                    sendJsonMessage(
                        createConfirmationOfferMessage(stringToUserId(target))
                    );
                    break;
            }
        });
        ictPhase.addEventListener(
            ICTEventID.sendOPNMessage,
            async (e: Event) => {
                if (!isSendOPNMessageEvent<string>(e)) throw new Error();

                const {
                    detail: { target, time, type, OPNMap },
                } = e;
                switch (type) {
                    case 'Call-Answer': {
                        console.log(
                            `Sending Call-Answer at ${time} to ${target}`
                        );
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
                        console.log(
                            `Sending Peer-Transfer at ${time} to ${target}`
                        );
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
            }
        );
        ictPhase.addEventListener(
            ICTEventID.sendICTMessage,
            async (e: Event) => {
                if (!isSendICTMessageEvent<string>(e)) throw new Error();

                const {
                    detail: { target, time, type, jwt, OPNMap },
                } = e;
                switch (type) {
                    case 'ICT-Offer':
                        console.log(
                            `Sending ICT-Offer at ${time} to ${target} with ict: ${jwt} `
                        );
                        if (!OPNMap) {
                            console.error('Missing OPN Map');
                            return;
                        }

                        const transportableOPNMap = Object.fromEntries(OPNMap);
                        sendJsonMessage(
                            createICTOfferMessage(
                                stringToUserId(target),
                                jwt,
                                transportableOPNMap
                            )
                        );
                        break;
                    case 'ICT-Answer':
                        console.log(
                            `Sending ICT-Answer at ${time} to ${target} with ict: ${jwt}`
                        );
                        sendJsonMessage(
                            createICTAnswerMessage(stringToUserId(target), jwt)
                        );
                        break;
                    case 'ICT-Transfer':
                        console.log(
                            `Sending ICT-Transfer at ${time} to ${target} with ict: ${jwt}`
                        );
                        sendJsonMessage(
                            createICTTransferMessage(
                                stringToUserId(target),
                                jwt
                            )
                        );

                        break;
                }
            }
        );
        ictPhase.addEventListener(
            ICTEventID.sendCandidates,
            async (e: Event) => {
                if (!isSendCandidatesMessageEvent<string>(e)) throw new Error();

                const {
                    detail: { target, time, candidateIDs },
                } = e;
                console.log(`Sending Candidates to ${target} at ${time}`);
                sendJsonMessage(
                    createCandidatesMessage(
                        stringToUserId(target),
                        candidateIDs.map(stringToUserId)
                    )
                );
            }
        );
        ictPhase.addEventListener(ICTEventID.verify, async (e: Event) => {
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
                    setVerifyPeerOPNCandidates(new Map(candidates));

                    break;
                case 'Peers':
                    console.log(`Starting Peers Authentication at ${time}`);
                    setVerifyPeerIdentityCandidates(new Map(candidates));
                    break;
            }
        });

        ictPhase.addEventListener(EventID.startSecret, async (e: Event) => {
            if (!isTimedEvent(e)) return;

            const {
                detail: { time },
            } = e;

            console.log(
                `All Confirmations received switching to Secret Exchange Phase at ${time}`
            );

            const { candidatesMap, keyPairs } =
                await ictPhase.getICTPhaseValues();

            secretExchangePhase.setupGroupLeader(
                await candidatesMap.exportToMap(),
                await keyPairs.exportToMap()
            );
        });
    }

    function attachSecretExchangePhaseEventListeners() {
        console.log('Attaching Event Listeners for SecretPhase');
        secretExchangePhase.addEventListener(
            sendSecretExchangeEventID,
            async (e: Event) => {
                if (!isSendSecretExchangeEvent<string>(e)) return;

                const {
                    detail: { target, time, type, jwt },
                } = e;

                switch (type) {
                    case 'sendGroupLeaderPubKeyDH':
                        console.log(
                            `Sending GroupLeader DH Pubkey at ${time} to ${target}`
                        );
                        sendJsonMessage(
                            createGroupLeaderPubKeyMessage(
                                stringToUserId(target),
                                jwt
                            )
                        );
                        break;
                    case 'sendMemberPubKeyDH':
                        console.log(
                            `Sending Member DH Pubkey at ${time} to ${target}`
                        );
                        sendJsonMessage(
                            createMemberPubKeyMessage(
                                stringToUserId(target),
                                jwt
                            )
                        );
                        break;
                    case 'sendSharedSecret':
                        console.log(
                            `Sending Shared Secret at ${time} to ${target}`
                        );
                        setIctDisplayPhase('waitForConnectionStart');
                        sendJsonMessage(
                            createSharedSecretMessage(
                                stringToUserId(target),
                                jwt
                            )
                        );
                        break;
                }
            }
        );
        secretExchangePhase.addEventListener(startSFUEventID, async () => {
            console.log('Negotiated shared secret. Starting SFU phase');
            setIctDisplayPhase('waitForConnectionStart');
            const { groupMemberMap, sharedSecret } =
                await secretExchangePhase.getSecretExchangePhaseValues();
            sfuPhase.setupSFUPhase(
                await groupMemberMap.exportToMap(),
                sharedSecret,
                callSettings,
                sendPostRequestWithAuthorization(accessToken),
                sendGetRequestWithAuthorization(accessToken)
            );
        });
    }

    function attachSFUPhaseEventListeners() {
        console.log('Attaching SFU Phase Listeners');
        sfuPhase.addEventListener(sendProductIdEventId, (e: Event) => {
            if (!isSendProductIdEvent<string>(e)) return;

            const {
                detail: { target, time, producerId },
            } = e;
            console.log(
                `Sending new Producer Id ${producerId} at ${time} to ${target}`
            );
            sendJsonMessage(
                createProducerIDMessage(stringToUserId(target), producerId)
            );
        });

        sfuPhase.addEventListener(newMediaStreamEventID, async (e: Event) => {
            if (!isTimedEvent(e)) return;

            const { localStream, members, encryptedLocalStream } =
                await sfuPhase.getSFUPhaseValues();
            setLocalStream(localStream);
            setEncryptedLocalStream(encryptedLocalStream);
            members && setSetsfuPhaseMembers(members);
        });
    }

    useEffect(() => {
        console.log('I updated because of sfuPhaseMembers', sfuPhaseMembers);
    }, [sfuPhaseMembers]);

    // useEffects for Display Switches
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
    useEffect(() => {
        if (
            ictDisplayPhase != 'waitForCandidates' ||
            verifyPeerOPNCandidates.size === 0
        ) {
            return;
        }
        setIctDisplayPhase('verifyPeerOPN');
    }, [verifyPeerOPNCandidates, ictDisplayPhase]);
    useEffect(() => {
        if (
            ictDisplayPhase != 'waitForPeerICTTransfer' ||
            verifyPeerIdentityCandidates.size === 0
        ) {
            return;
        }
        setIctDisplayPhase('verifyPeerIdentity');
    }, [verifyPeerIdentityCandidates, ictDisplayPhase]);

    useEffect(() => {
        if (
            ictDisplayPhase != 'waitForConnectionStart' ||
            sfuPhaseMembers.size === 0
        ) {
            return;
        }
        setIctDisplayPhase('showStreams');
    });

    // Local Signaling Handler
    useEffect(() => {
        signalingMessageHandler(
            lastJsonMessage,
            ictPhase,
            secretExchangePhase,
            sfuPhase
        );
    }, [lastJsonMessage]);

    const localRef = useRef<HTMLVideoElement>(null);
    const remoteRef = useRef<HTMLVideoElement>(null);

    async function onYesHandlerCallerICTSelection(
        trustedOIDCProviders: ICTProviderInfo[],
        getICTParameters: {
            openIDProviderInfo: ICTProviderInfo;
            tokenSet: TokenSet;
            targets: string[];
        }[]
    ) {
        ictPhase.setCallerParameters(trustedOIDCProviders, getICTParameters);
        setIctDisplayPhase('waitForICTAnswer');
    }
    async function onYesHandlerVerifyCaller(
        oidcProvider: ICTProviderInfo,
        tokenSet: TokenSet,
        target: string
    ) {
        ictPhase.setAuthenticated([target]);
        ictPhase.setCalleeParameters(oidcProvider, tokenSet, target);

        if (type === 'call' || candidates.length == 1) {
            setIctDisplayPhase('waitForConnectionStart');
            // TODO Switch to WebRTCPhase
        } else {
            setIctDisplayPhase('waitForCandidates');
        }
    }

    async function onYesHandlerVerifyCallee(
        newAuthenticatedCandidates: string[]
    ) {
        await ictPhase.setAuthenticated(newAuthenticatedCandidates);

        if (type === 'call') {
            setIctDisplayPhase('waitForConnectionStart');
            console.log('Starting WebRTC Phase');
            // TODO Switch to WebRTCPhase
        } else {
            setIctDisplayPhase('waitForConfirmations');
            ictPhase.sendCandidatesToPeers();
        }
    }

    async function onYesHandlerVerifyPeerOPN(
        getICTParameters: {
            openIDProviderInfo: ICTProviderInfo;
            tokenSet: TokenSet;
            targets: string[];
        }[]
    ) {
        ictPhase.setPeersOpenIDProvider(getICTParameters);
        setIctDisplayPhase('waitForPeerICTTransfer');
    }

    async function onYesHandlerVerifyPeerIdentity(
        newAuthenticatedCandidates: string[]
    ) {
        await ictPhase.setAuthenticated(newAuthenticatedCandidates);
        const { candidatesMap, keyPairs } = await ictPhase.getICTPhaseValues();
        secretExchangePhase.setupGroupMember(
            await candidatesMap.exportToMap(),
            await keyPairs.exportToMap(),
            ictPhase.groupLeaderID as string
        );
        ictPhase.sendConfirmation();
        console.log(
            'All necessary ICT Phase Values received. Preparing for KeyExchangePhase.'
        );
        setIctDisplayPhase('waitForKeyExchange');
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
                onYesHandlerVerifyCallee,
                verifyCalleeIdentityCandidates,
                verifyOPNCandidates,
                verifyCallerIdentityAndCreateICTAnswerCandidates,
                verifyPeerOPNCandidates,
                verifyPeerIdentityCandidates,
                onYesHandlerVerifyPeerIdentity,
                onYesHandlerVerifyPeerOPN,
                sfuPhaseMembers,
                localStream,
                encryptedLocalStream,
            }}
        />
    );
}
function resetObjects() {
    console.log('Resetting Phase Objects');
    ictPhase = new ICTPhaseGroup<string>();
    secretExchangePhase = new SecretExchangePhase<string>();
    sfuPhase = new SFUPhaseReceive<string>();
}
