import { useEffect } from 'react';
import { ICTPhaseGroup } from '../helpers/ICTPhase/ICTPhase';
import useSignaling from '../hooks/useSignaling';
import { useToken } from '../hooks/useToken';

import {} from '../helpers/ICTPhase/Events';
import {} from '../helpers/ICTPhase/EventCheckers';
import { UserId } from '../helpers/Signaling/User';
import { Message } from '../helpers/Signaling/Messages';
import { SecretExchangePhase } from '../helpers/SecretExchangePhase/SecretExchangePhase';
import {
    sendGroupLeaderPubKeyDHEventID,
    sendMemberPubKeyDHEventID,
    sendSharedSecretEventID,
} from '../helpers/SecretExchangePhase/Events';
import {
    isSendGroupLeaderPubKeyDHEvent,
    isSendMemberPubKeyDHEvent,
    isSendSharedSecretEvent,
} from '../helpers/SecretExchangePhase/EventCheckers';

const ictPhase = new ICTPhaseGroup();
const secretExchangePhase = new SecretExchangePhase();

export default function ConferencePage() {
    const { accessToken, signalingUrl } = useToken({ needsToken: true });
    const {
        socket: { sendJsonMessage, lastJsonMessage },
    } = useSignaling({ socketUrl: signalingUrl });

    // useEffect(() => {
    //     // Event listener for sendGroupLeaderPubKeyDHEvent
    //     secretExchangePhase.addEventListener(
    //         sendGroupLeaderPubKeyDHEventID,
    //         (e) => {
    //             if (!isSendGroupLeaderPubKeyDHEvent<UserId>(e)) {
    //                 throw new Error(
    //                     `${sendGroupLeaderPubKeyDHEventID} is missing values`
    //                 );
    //             }
    //             const {
    //                 detail: { target, time, jwt },
    //             } = e;
    //             console.log(`GroupLeaderPubKeyDH:${time}`);

    //             const newGroupLeaderPubKeyDHMessage: Message = {
    //                 type: 'GroupLeaderPubKeyDH',
    //                 target: target,
    //                 body: { jwt },
    //             };

    //             sendJsonMessage(newGroupLeaderPubKeyDHMessage);
    //         }
    //     );

    //     // Event listener for sendMemberPubKeyDHEvent
    //     secretExchangePhase.addEventListener(sendMemberPubKeyDHEventID, (e) => {
    //         if (!isSendMemberPubKeyDHEvent<UserId>(e)) {
    //             throw new Error(
    //                 `${sendMemberPubKeyDHEventID} is missing values`
    //             );
    //         }
    //         const {
    //             detail: { target, time, jwt },
    //         } = e;
    //         console.log(`MemberPubKeyDH:${time}`);

    //         const newMemberPubKeyDHMessage: Message = {
    //             type: 'MemberPubKeyDH',
    //             target: target,
    //             body: { jwt },
    //         };

    //         sendJsonMessage(newMemberPubKeyDHMessage);
    //     });

    //     // Event listener for sendSharedSecretEvent
    //     secretExchangePhase.addEventListener(sendSharedSecretEventID, (e) => {
    //         if (!isSendSharedSecretEvent<UserId>(e)) {
    //             throw new Error(`${sendSharedSecretEventID} is missing values`);
    //         }
    //         const {
    //             detail: { target, time, jwt },
    //         } = e;
    //         console.log(`SharedSecret:${time}`);

    //         const newSharedSecretMessage: Message = {
    //             type: 'SharedSecret',
    //             target: target,
    //             body: { jwt },
    //         };

    //         sendJsonMessage(newSharedSecretMessage);
    //     });
    // });

    // useEffect(() => {
    //     // Event listener for sendCallOfferEvent
    //     ictPhase.addEventListener(sendCallOfferEventId, (e) => {
    //         if (!isSendCallOfferEvent<UserId>(e)) {
    //             throw new Error(`${sendCallOfferEventId} is missing values`);
    //         }
    //         const {
    //             detail: { target, time },
    //         } = e;
    //         console.log(`CallOffer:${time}`);

    //         const newCallOfferMessage: Message = {
    //             type: 'CallOffer',
    //             target: target,
    //             body: {},
    //         };

    //         sendJsonMessage(newCallOfferMessage);
    //     });

    //     // Event listener for sendCallAnswerEvent
    //     ictPhase.addEventListener(sendCallAnswerEventId, (e) => {
    //         if (!isSendCallAnswerEvent<UserId>(e)) {
    //             throw new Error(`${sendCallAnswerEventId} is missing values`);
    //         }
    //         const {
    //             detail: { target, time, OPNMap: OPs },
    //         } = e;
    //         console.log(`CallAnswer:${time}`);

    //         const newCallAnswerMessage: Message = {
    //             type: 'CallAnswer',
    //             target: target,
    //             body: { OPs },
    //         };

    //         sendJsonMessage(newCallAnswerMessage);
    //     });

    //     // Event listener for sendOPsToPeersEvent
    //     ictPhase.addEventListener(sendOPsToPeersEventId, (e) => {
    //         if (!isSendOPsToPeersEvent<UserId>(e)) {
    //             throw new Error(`${sendOPsToPeersEventId} is missing values`);
    //         }
    //         const {
    //             detail: { target, time, OPNMap: OPs },
    //         } = e;
    //         console.log(`OPsToPeers:${time}`);

    //         const newOPsToPeersMessage: Message = {
    //             type: 'OPsToPeers',
    //             target: target,
    //             body: { OPs },
    //         };

    //         sendJsonMessage(newOPsToPeersMessage);
    //     });

    //     // Event listener for sendICTOfferEvent
    //     ictPhase.addEventListener(sendICTOfferEventId, (e) => {
    //         if (!isSendICTOfferEvent<UserId>(e)) {
    //             throw new Error(`${sendICTOfferEventId} is missing values`);
    //         }
    //         const {
    //             detail: { target, time, jwt },
    //         } = e;
    //         console.log(`ICTOffer:${time}`);

    //         const newICTOfferMessage: Message = {
    //             type: 'ICTOffer',
    //             target: target,
    //             body: { jwt },
    //         };

    //         sendJsonMessage(newICTOfferMessage);
    //     });

    //     // Event listener for sendICTAnswerEvent
    //     ictPhase.addEventListener(sendICTAnswerEventId, (e) => {
    //         if (!isSendICTAnswerEvent<UserId>(e)) {
    //             throw new Error(`${sendICTAnswerEventId} is missing values`);
    //         }
    //         const {
    //             detail: { target, time, jwt },
    //         } = e;
    //         console.log(`ICTAnswer:${time}`);

    //         const newICTAnswerMessage: Message = {
    //             type: 'ICTAnswer',
    //             target: target,
    //             body: { jwt },
    //         };

    //         sendJsonMessage(newICTAnswerMessage);
    //     });

    //     // Event listener for sendStartExchangeEvent
    //     ictPhase.addEventListener(sendTargetsEventId, (e) => {
    //         if (!isSendTargetsEvent<UserId>(e)) {
    //             throw new Error(`${sendTargetsEventId} is missing values`);
    //         }
    //         const {
    //             detail: { target, time, jwt },
    //         } = e;
    //         console.log(`StartExchange:${time}`);

    //         const newStartExchangeMessage: Message = {
    //             type: 'StartExchange',
    //             target: target,
    //             body: { jwt },
    //         };

    //         sendJsonMessage(newStartExchangeMessage);
    //     });

    //     // Event listener for sendICTPeerMessageEvent
    //     ictPhase.addEventListener(sendICTPeerMessageEventId, (e) => {
    //         if (!isSendICTPeerMessageEvent<UserId>(e)) {
    //             throw new Error(
    //                 `${sendICTPeerMessageEventId} is missing values`
    //             );
    //         }
    //         const {
    //             detail: { target, time, jwt },
    //         } = e;
    //         console.log(`ICTPeerMessage:${time}`);

    //         const newICTPeerMessage: Message = {
    //             type: 'ICTPeerMessage',
    //             target: target,
    //             body: { jwt },
    //         };

    //         sendJsonMessage(newICTPeerMessage);
    //     });

    //     // Event listener for sendConfirmationEvent
    //     ictPhase.addEventListener(sendConfirmationEventId, (e) => {
    //         if (!isSendConfirmationEvent<UserId>(e)) {
    //             throw new Error(`${sendConfirmationEventId} is missing values`);
    //         }
    //         const {
    //             detail: { target, time, sign, nonce },
    //         } = e;
    //         console.log(`Confirmation:${time}`);

    //         const newConfirmationMessage: Message = {
    //             type: 'Confirmation',
    //             target: target,
    //             body: { sign, nonce },
    //         };

    //         sendJsonMessage(newConfirmationMessage);
    //     });

    //     // Event listener for sendICTPhaseFailedEventID
    //     ictPhase.addEventListener(sendICTPhaseFailedEventID, (e) => {
    //         if (!isSendICTPhaseFailedEvent<UserId>(e)) {
    //             throw new Error(
    //                 `${sendICTPhaseFailedEventID} is missing values`
    //             );
    //         }
    //         const {
    //             detail: { target, time },
    //         } = e;
    //         console.log(`ICTPhaseFailed:${time}`);

    //         const newICTPhaseFailedMessage: Message = {
    //             type: 'ICTPhaseFailed',
    //             target: target,
    //             body: {},
    //         };

    //         sendJsonMessage(newICTPhaseFailedMessage);
    //     });
    // }, []);
    return <></>;
}
