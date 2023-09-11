import { UserId, UserInfo } from './User';

export type MessageType =
    | 'userList'
    | 'userOnline'
    | 'userOffline'
    | 'call-offer'
    | 'call-answer'
    | 'hang-up'
    | 'CallOffer'
    | 'CallAnswer'
    | 'OPsToPeers'
    | 'ICTOffer'
    | 'ICTAnswer'
    | 'StartExchange'
    | 'ICTPeerMessage'
    | 'Confirmation'
    | 'ICTPhaseFailed';

export interface Message {
    type: MessageType;
    origin?: UserId;
    target?: UserId;
    body?: any;
}

interface WebRTCBody {
    desc: RTCSessionDescription;
}
export interface WebRTCMessage extends Message {
    body: WebRTCBody;
}

export function createSDPMessage(
    type: MessageType,
    target: UserId,
    desc: RTCSessionDescription
) {
    const msg: WebRTCMessage = { type, target, body: { desc } };
    return msg;
}

interface userListBody {
    users: UserInfo[];
}
export interface userListMessage extends Message {
    body?: userListBody;
}
export function createUserListMessage() {
    const msg: userListMessage = { type: 'userList' };
    return msg;
}

interface userOnlineBody {
    user: UserInfo;
}
export interface userOnlineMessage extends Message {
    body: userOnlineBody;
}

interface userOfflineBody {
    user: UserId;
}
export interface userOfflineMessage extends Message {
    body: userOfflineBody;
}

export interface hangUpMessage extends Message {}

export function createHangUpMessage(target: UserId) {
    const msg: hangUpMessage = {
        type: 'hang-up',
        target,
    };
    return msg;
}
