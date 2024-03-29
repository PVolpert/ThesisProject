import { incomingUserListMessage, incomingUserStateMessage } from './Messages';
import { UserId, isUserEqual, userIdToString } from './User';
import {
    isCandidatesMessage,
    isICTMessage,
    isIncomingMessage,
    isIncomingUserListMessage,
    isIncomingUserStateMessage,
    isOPNMessage,
    isOriginMessage,
    isSendProducerIdMessage as isSendProducerIdMessage,
    isSendSecretExchangeMessage,
} from './MessageChecker';
import { ICTPhaseGroup } from '../ICTPhase/ICTPhase';
import { SecretExchangePhase } from '../SecretExchangePhase/SecretExchangePhase';
import { SFUPhaseReceive } from '../SFUPhase/SFUPhase';

// user* Message Handlers

export async function incomingUserOnlineHandler(
    { body: { user: newUser } }: incomingUserStateMessage,
    self: UserId,
    activeUsers: UserId[],
    setActiveUsers: (newActiveUsers: UserId[]) => void
) {
    // Ignore self
    if (isUserEqual(newUser, self)) {
        return;
    }

    setActiveUsers(activeUsers.concat(newUser));
}
export async function incomingUserOfflineHandler(
    { body: { user } }: incomingUserStateMessage,
    activeUsers: UserId[],
    setActiveUsers: (newActiveUsers: UserId[]) => void
) {
    setActiveUsers(
        activeUsers.filter((prevUser) => {
            return !isUserEqual(prevUser, user);
        })
    );
}
export async function incomingUserListHandler(
    { body: { users } }: incomingUserListMessage,
    setActiveUsers: (newActiveUsers: UserId[]) => void,
    self: UserId
) {
    const newUserList = users.filter((user) => {
        return !isUserEqual(user, self);
    });

    setActiveUsers(newUserList);
}

export async function globalMessageHandler(
    rawMessage: any,
    activeUsers: UserId[],
    self: UserId,
    setActiveUsers: (newActiveUsers: UserId[]) => void,
    setCaller: (newCaller: UserId) => void,
    setType: (newMode: 'conference' | 'call') => void,
    showIncomingCallModal: () => void
) {
    if (!isIncomingMessage(rawMessage)) {
        console.log('Ignoring invalid message');
        return;
    }
    const { type } = rawMessage;
    switch (type) {
        case 'userList':
            if (!isIncomingUserListMessage(rawMessage)) {
                console.log('Ignoring invalid message');
                return;
            }

            incomingUserListHandler(rawMessage, setActiveUsers, self);
            break;
        case 'userOnline':
            if (!isIncomingUserStateMessage(rawMessage)) {
                console.log('Ignoring invalid message');
                return;
            }
            incomingUserOnlineHandler(
                rawMessage,
                self,
                activeUsers,
                setActiveUsers
            );
            break;
        case 'userOffline':
            if (!isIncomingUserStateMessage(rawMessage)) {
                console.log('Ignoring invalid message');
                return;
            }
            incomingUserOfflineHandler(rawMessage, activeUsers, setActiveUsers);
            break;
        case 'Call-Offer':
            if (!isOriginMessage(rawMessage)) {
                console.log('Ignoring invalid message');
                return;
            }
            setCaller(rawMessage.origin);
            setType('call');
            showIncomingCallModal();
            break;
        case 'Conference-Offer':
            if (!isOriginMessage(rawMessage)) {
                console.log('Ignoring invalid message');
                return;
            }
            setCaller(rawMessage.origin);
            setType('conference');
            showIncomingCallModal();
            break;
    }
}

export async function signalingMessageHandler(
    lastJsonMessage: unknown,
    ictPhase: ICTPhaseGroup<string>,
    secretExchangePhase: SecretExchangePhase<string>,
    sfuPhase: SFUPhaseReceive<string>
) {
    if (
        !lastJsonMessage ||
        !isIncomingMessage(lastJsonMessage) ||
        !isOriginMessage(lastJsonMessage)
    ) {
        return;
    }

    const { type, origin } = lastJsonMessage;

    //? Might want to handle errors with try catch
    //? Errors that are caused by calling the function to soon could be remedied
    switch (type) {
        case 'Call-Answer': {
            if (!isOPNMessage(lastJsonMessage)) return;
            console.log(
                `Incoming call-answer message at ${Date.now()} from ${
                    origin.username
                }`
            );
            const {
                body: { OPNMap: transportableOPNMap },
            } = lastJsonMessage;

            ictPhase.setCallAnswer(
                userIdToString(origin),
                new Map<string, string>(Object.entries(transportableOPNMap))
            );
            break;
        }
        case 'Peer-OPN': {
            if (!isOPNMessage(lastJsonMessage)) return;
            console.log(
                `Incoming Peer-OPN message at ${Date.now()} from ${
                    origin.username
                }`
            );
            const {
                body: { OPNMap: transportableOPNMap },
            } = lastJsonMessage;
            ictPhase.setPeerOPN(
                userIdToString(origin),
                new Map<string, string>(Object.entries(transportableOPNMap))
            );
            break;
        }
        case 'ICT-Offer': {
            if (!isICTMessage(lastJsonMessage)) return;
            console.log(
                `Incoming ICT-Offer message at ${Date.now()} from ${
                    origin.username
                }`
            );
            const {
                body: { jwt, OPNMap: transportableOPNMap },
            } = lastJsonMessage;
            if (!transportableOPNMap) {
                console.error('Missing OPN Map');
                return;
            }
            ictPhase.setICTOffer(
                userIdToString(origin),
                jwt,
                new Map<string, string>(Object.entries(transportableOPNMap))
            );
            break;
        }
        case 'ICT-Answer': {
            if (!isICTMessage(lastJsonMessage)) return;
            console.log(
                `Incoming ICT-Answer message at ${Date.now()} from ${
                    origin.username
                }`
            );
            const {
                body: { jwt },
            } = lastJsonMessage;
            ictPhase.setICTAnswer(userIdToString(origin), jwt);
            break;
        }
        case 'ICT-Transfer': {
            if (!isICTMessage(lastJsonMessage)) return;
            console.log(
                `Incoming ICT-Transfer message at ${Date.now()} from ${
                    origin.username
                }`
            );
            const {
                body: { jwt },
            } = lastJsonMessage;
            ictPhase.setICTTransfer(userIdToString(origin), jwt);
            break;
        }
        case 'Candidates': {
            if (!isCandidatesMessage(lastJsonMessage)) return;
            console.log(
                `Incoming Candidates message at ${Date.now()} from ${
                    origin.username
                }`
            );
            const {
                body: { candidateIDs },
            } = lastJsonMessage;
            ictPhase.setCandidates(
                userIdToString(origin),
                candidateIDs.map(userIdToString)
            );
            break;
        }

        case 'Confirmation':
            console.log(
                `Incoming Confirmation message at ${Date.now()}  from ${
                    origin.username
                }`
            );
            ictPhase.setConfirmation(userIdToString(origin));
            break;

        // Secret Exchange Type Message Handlers
        case 'GroupLeaderPubKeyDH': {
            if (!isSendSecretExchangeMessage(lastJsonMessage)) return;
            console.log(
                `Incoming Group Leader PubKey message at ${Date.now()}  from ${
                    origin.username
                }`
            );

            const {
                body: { jwt },
            } = lastJsonMessage;
            secretExchangePhase.setGroupLeaderDHParameter(
                userIdToString(origin),
                jwt
            );
            break;
        }

        case 'MemberPubKeyDH': {
            if (!isSendSecretExchangeMessage(lastJsonMessage)) return;
            console.log(
                `Incoming Member PubKey message at ${Date.now()}  from ${
                    origin.username
                }`
            );
            const {
                body: { jwt },
            } = lastJsonMessage;
            secretExchangePhase.setMemberDHParameters(
                userIdToString(origin),
                jwt
            );
            break;
        }

        case 'SharedSecret':
            if (!isSendSecretExchangeMessage(lastJsonMessage)) return;
            console.log(
                `Incoming Shared Secret message at ${Date.now()}  from ${
                    origin.username
                }`
            );
            const {
                body: { jwt },
            } = lastJsonMessage;
            secretExchangePhase.setSharedSecret(userIdToString(origin), jwt);
            break;

        case 'ProducerId':
            if (!isSendProducerIdMessage(lastJsonMessage)) return;

            console.log(
                `Incoming Producer Id message at ${Date.now()} frin ${
                    origin.username
                }`
            );
            const {
                body: { producerId },
            } = lastJsonMessage;

            sfuPhase.setNewConsumer(userIdToString(origin), producerId);
    }
}
