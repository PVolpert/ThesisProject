import { UserId, UserInfo } from './User';

export type MessageType =
    | 'userList'
    | 'userOnline'
    | 'userOffline'
    | 'call-offer'
    | 'call-answer'
    | 'new-icecandidate'
    | 'hang-up';

export interface Message {
    type: MessageType;
    origin?: UserId;
    target?: UserId;
    body?: any;
}

interface SdpBody {
    desc: RTCSessionDescription;
    // TODO Switch from string to ict token
    ict?: string[];
}
export interface SdpMessage extends Message {
    body: SdpBody;
}

export function createSDPMessage(
    type: MessageType,
    target: UserId,
    desc: RTCSessionDescription,
    ict?: string[]
) {
    const msg: SdpMessage = { type, target, body: { desc } };
    return msg;
}

export interface IceCandidateBody {
    candidate: RTCIceCandidate;
}

export interface IceCandidateMessage extends Message {
    body: IceCandidateBody;
}

export function createIceCandidateMessage(
    target: UserId,
    candidate: RTCIceCandidate
) {
    const msg: IceCandidateMessage = {
        type: 'new-icecandidate',
        target,
        body: { candidate },
    };
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
