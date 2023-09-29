import {
    Message,
    incomingCandidatesMessage,
    incomingICTMessage,
    incomingMessage,
    incomingOPNMessage,
    incomingOriginMessage,
    incomingUserListMessage,
    incomingUserStateMessage,
} from './Messages';

export function isIncomingMessage(
    rawMessage: any
): rawMessage is incomingMessage {
    return 'type' in rawMessage && 'body' in rawMessage;
}

// User State Messages

export function isIncomingUserStateMessage(
    message: incomingMessage
): message is incomingUserStateMessage {
    return 'user' in message.body;
}
export function isIncomingUserListMessage(
    message: incomingMessage
): message is incomingUserListMessage {
    return 'users' in message.body;
}

// ICT Phase Messages

export function isOriginMessage(
    message: incomingMessage
): message is incomingOriginMessage {
    return 'origin' in message;
}

export function isOPNMessage(
    message: incomingOriginMessage
): message is incomingOPNMessage {
    return 'OPNMap' in message.body;
}
export function isICTMessage(
    message: incomingOriginMessage
): message is incomingICTMessage {
    return 'jwt' in message.body;
}
export function isCandidatesMessage(
    message: incomingOriginMessage
): message is incomingCandidatesMessage {
    return 'candidateIDs' in message.body;
}
