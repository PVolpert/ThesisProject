import { IDToken } from 'oauth4webapi';
import {
    IceCandidateMessage,
    SdpMessage,
    hangUpMessage as HangUpMessage,
    userListMessage,
    userOfflineMessage,
    userOnlineMessage,
} from './Messages';
import { UserId, UserInfo, isUserEqual } from './User';

// user* Message Handlers

const maxRetries = 100;

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

// Call Message Handlers

export async function incomingCallHandler(
    msg: SdpMessage,
    answerCall: (msg: SdpMessage) => void
) {
    const { origin, body: { desc } = {} } = msg;
    if (!origin) {
        console.error('missing message origin');
    }
    if (!desc) {
        console.error('missing sdp in message body');
        return;
    }
    // console.log('incoming offer sdp', sdp);

    answerCall(msg);
}

//* RTC Message Handlers

export async function incomingOfferHandler(msg: SdpMessage) {
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
    msg: SdpMessage,
    RTCConnection: RTCPeerConnection | undefined
) {
    // ! check if origin matches prior connection
    const { origin, body: { desc } = {} } = msg;
    if (!origin) {
        console.error('sdp Message is missing origin');
        return;
    }
    if (!desc) {
        console.error('sdp Message is missing body');
        return;
    }
    try {
        //! We verify and prompt callee ict here
        console.log(`Callee is from ${origin} with id ${origin.subject}`);
        // if (
        // window.confirm(
        // `Do you want to call ${origin.issuer} ${origin.subject}?`
        // )
        // ) {
        const valRTCConnection = await waitForRTCPeerConnection(RTCConnection);
        valRTCConnection.setRemoteDescription(desc).catch((err) => {
            console.error(err);
        });
        // } else {
        //     throw 'Call denied';
        // }
    } catch (error) {
        // TODO navigate back to /call
        console.log(error);
    }
}

export async function incomingIceCandidateHandler(
    msg: IceCandidateMessage,
    RTCConnection: RTCPeerConnection | undefined
) {
    const { body: { candidate } = {} } = msg;
    if (!candidate) {
        console.error('sdp Message is missing body');
        return;
    }
    try {
        //Remote Description must be set before adding ICE Candidates
        const valRTCConnection = await waitForRTCPeerConnection(RTCConnection);
        await waitForRemoteDescription(valRTCConnection);
        //Add the Ice Candidate
        console.log('Adding the ice candidate');
        const newIceCandidate = new RTCIceCandidate(candidate);
        valRTCConnection.addIceCandidate(newIceCandidate);
    } catch (error) {
        console.log(error);
    }
}

async function waitForRemoteDescription(RTCConnection: RTCPeerConnection) {
    return new Promise<void>((resolve, reject) => {
        const checkRemoteDescription = (tries: number) => {
            // Stop if there is no RTCConnection
            if (!RTCConnection || tries > maxRetries) {
                reject('No RTCPeerConnection or max retries reached');
            }
            // Restart if there is no remoteDescription
            if (!RTCConnection.remoteDescription) {
                setTimeout(checkRemoteDescription, 200, tries + 1);
            } else {
                // Proceed if there is a remoteDescription
                resolve();
            }
        };
        checkRemoteDescription(0);
    });
}
async function waitForRTCPeerConnection(
    RTCConnection: RTCPeerConnection | undefined
) {
    return new Promise<RTCPeerConnection>((resolve, reject) => {
        const checkRemoteDescription = (tries: number) => {
            // Restart if there is no remoteConnection
            if (tries > maxRetries) {
                reject('Max retries reaced');
            }
            if (!RTCConnection) {
                setTimeout(checkRemoteDescription, 200);
            } else {
                // Proceed if there is a rtcConnection
                resolve(RTCConnection);
            }
        };
        checkRemoteDescription(0);
    });
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
