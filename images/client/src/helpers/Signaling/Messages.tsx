import { OPNMap } from '../ICTPhase/ICTPhase';
import { UserId, UserInfo } from './User';

export type MessageType =
    // User State Messages
    | 'userList'
    | 'userOnline'
    | 'userOffline'
    // ICT Phase Messages
    | 'Call-Offer'
    | 'Conference-Offer'
    | 'Confirmation'
    | 'Call-Answer'
    | 'Peer-OPN'
    | 'ICT-Offer'
    | 'ICT-Answer'
    | 'ICT-Transfer'
    | 'Candidates';

// TODO Add other Messages

export interface Message {
    type: MessageType;
    origin?: UserId;
    target?: UserId;
    body?: any;
}
export interface incomingMessage extends Message {
    body: any;
}

export interface incomingOriginMessage extends incomingMessage {
    origin: UserId;
}

interface userListBody {
    users: UserInfo[];
}
export interface userListMessage extends Message {
    body?: userListBody;
}
export interface incomingUserListMessage extends incomingMessage {
    body: userListBody;
}
export function createUserListMessage() {
    const msg: userListMessage = { type: 'userList' };
    return msg;
}

interface userStateBody {
    user: UserInfo;
}
export interface incomingUserStateMessage extends incomingMessage {
    body: userStateBody;
}

// ICT Phase Messages

export interface notifyMessage extends Message {}

export function createCallOfferMessage(target: UserId) {
    const msg: notifyMessage = { type: 'Call-Offer', target, body: {} };
    return msg;
}

export function createConferenceOfferMessage(target: UserId) {
    const msg: notifyMessage = { type: 'Conference-Offer', target, body: {} };
    return msg;
}
export function createConfirmationOfferMessage(target: UserId) {
    const msg: notifyMessage = { type: 'Confirmation', target, body: {} };
    return msg;
}

export interface OPNMessageBody {
    OPNMap: {
        [k: string]: string;
    };
}

export interface OPNMessage extends Message {
    body: OPNMessageBody;
}

export interface incomingOPNMessage extends incomingOriginMessage {
    body: OPNMessageBody;
}

export function createCallAnswerMessage(
    target: UserId,
    OPNMap: {
        [k: string]: string;
    }
) {
    const msg: OPNMessage = { type: 'Call-Answer', target, body: { OPNMap } };
    return msg;
}
export function createPeerOPNMessage(
    target: UserId,
    OPNMap: {
        [k: string]: string;
    }
) {
    const msg: OPNMessage = { type: 'Peer-OPN', target, body: { OPNMap } };
    return msg;
}
export interface ictMessageBody {
    jwt: string;
}

export interface ictMessage extends Message {
    body: ictMessageBody;
}

export interface incomingICTMessage extends incomingOriginMessage {
    body: ictMessageBody;
}

export function createICTOfferMessage(target: UserId, jwt: string) {
    const msg: ictMessage = { type: 'ICT-Offer', target, body: { jwt } };
    return msg;
}
export function createICTAnswerMessage(target: UserId, jwt: string) {
    const msg: ictMessage = { type: 'ICT-Answer', target, body: { jwt } };
    return msg;
}
export function createICTTransferMessage(target: UserId, jwt: string) {
    const msg: ictMessage = { type: 'ICT-Transfer', target, body: { jwt } };
    return msg;
}

export interface candidatesMessageBody {
    candidateIDs: UserId[];
}

export interface candidatesMessage extends Message {
    body: candidatesMessageBody;
}

export interface incomingCandidatesMessage extends incomingOriginMessage {
    body: candidatesMessageBody;
}

export function createCandidatesMessage(
    target: UserId,
    candidateIDs: UserId[]
) {
    const msg: candidatesMessage = {
        type: 'Candidates',
        target,
        body: { candidateIDs },
    };
    return msg;
}
