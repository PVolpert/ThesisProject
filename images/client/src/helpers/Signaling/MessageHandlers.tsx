import { IDToken } from 'oauth4webapi';
import {
    WebRTCMessage,
    hangUpMessage as HangUpMessage,
    userListMessage,
    userOfflineMessage,
    userOnlineMessage,
} from './Messages';
import { UserId, UserInfo, isUserEqual } from './User';

// user* Message Handlers

export async function incomingUserOnlineHandler(
    msg: userOnlineMessage,
    setUserList: (value: React.SetStateAction<UserInfo[]>) => void,
    idToken: IDToken | null
) {
    if (!idToken) {
        return;
    }
    const { body: { user } = {} } = msg;
    if (!user) {
        console.error('useronline message is missing user');
        return;
    }
    if (isUserEqual(user, { issuer: idToken.iss, subject: idToken.sub })) {
        return;
    }

    setUserList((prevList) => {
        return prevList.concat(user);
    });
}
export async function incomingUserOfflineHandler(
    msg: userOfflineMessage,
    setUserList: (value: React.SetStateAction<UserInfo[]>) => void
) {
    const { body: { user } = {} } = msg;
    if (!user) {
        console.error('useroffline message is missing user');
        return;
    }
    setUserList((prevList) => {
        return prevList.filter((prevUser) => {
            return !isUserEqual(prevUser, user);
        });
    });
}
export async function incomingUserListHandler(
    msg: userListMessage,
    setUserList: (value: React.SetStateAction<UserInfo[]>) => void,
    idToken: IDToken
) {
    if (!idToken) {
        return;
    }
    const { body: { users } = {} } = msg;
    if (!users) {
        console.error('userlist Message is missing users');
        return;
    }
    const newUserList = users.filter((user) => {
        return !isUserEqual(user, {
            issuer: idToken.iss,
            subject: idToken.sub,
        });
    });

    setUserList(newUserList);
}

//* RTC Message Handlers

export async function incomingOfferHandler(msg: WebRTCMessage) {
    // ? Will become more important when changing video/audio
    // ignore incoming requests if already in a call
    const { body: { desc } = {} } = msg;
    if (!desc) {
        console.error('sdp Message is missing body');
        return;
    }
    console.error('unexpected offer');
}

export async function incomingAnswerHandler(
    msg: WebRTCMessage,
    RTCConnection: RTCPeerConnection
) {
    const { origin, body: { desc } = {} } = msg;
    if (!origin) {
        console.error('sdp Message is missing origin');
        return;
    }
    if (!desc) {
        console.error('sdp Message is missing body');
        return;
    }

    //TODO Validate ICT here

    try {
        RTCConnection.setRemoteDescription(desc).catch((err) => {
            throw err;
        });
    } catch (error) {
        // TODO navigate back to /call
        throw error;
    }
}

export function validateHangUp(
    msg: HangUpMessage,
    callPartner: UserId | undefined
) {
    const { origin } = msg;

    if (!origin || !callPartner || !isUserEqual(callPartner, origin)) {
        return false;
    }
    return true;
}
