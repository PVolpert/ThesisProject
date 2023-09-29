import { IDToken } from 'oauth4webapi';
import { incomingUserListMessage, incomingUserStateMessage } from './Messages';
import { UserId, UserInfo, isUserEqual } from './User';
import {
    isIncomingMessage,
    isIncomingUserListMessage,
    isIncomingUserStateMessage,
    isOriginMessage,
} from './MessageChecker';

// user* Message Handlers

export async function incomingUserOnlineHandler(
    { body: { user } }: incomingUserStateMessage,
    setActiveUsers: (newActiveUsers: UserInfo[]) => void,
    activeUsers: UserInfo[],
    idToken: IDToken
) {
    // Ignore self
    if (isUserEqual(user, { issuer: idToken.iss, subject: idToken.sub })) {
        return;
    }

    setActiveUsers(activeUsers.concat(user));
}
export async function incomingUserOfflineHandler(
    { body: { user } }: incomingUserStateMessage,
    setActiveUsers: (newActiveUsers: UserInfo[]) => void,
    activeUsers: UserInfo[]
) {
    setActiveUsers(
        activeUsers.filter((prevUser) => {
            return !isUserEqual(prevUser, user);
        })
    );
}
export async function incomingUserListHandler(
    { body: { users } }: incomingUserListMessage,
    setActiveUsers: (newActiveUsers: UserInfo[]) => void,
    idToken: IDToken
) {
    const newUserList = users.filter((user) => {
        return !isUserEqual(user, {
            issuer: idToken.iss,
            subject: idToken.sub,
        });
    });

    setActiveUsers(newUserList);
}

export async function globalMessageHandler(
    rawMessage: any,
    setActiveUsers: (newActiveUsers: UserInfo[]) => void,
    activeUsers: UserInfo[],
    idToken: IDToken,
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

            incomingUserListHandler(rawMessage, setActiveUsers, idToken);
            break;
        case 'userOnline':
            if (!isIncomingUserStateMessage(rawMessage)) {
                console.log('Ignoring invalid message');
                return;
            }
            incomingUserOnlineHandler(
                rawMessage,
                setActiveUsers,
                activeUsers,
                idToken
            );
            break;
        case 'userOffline':
            if (!isIncomingUserStateMessage(rawMessage)) {
                console.log('Ignoring invalid message');
                return;
            }
            incomingUserOfflineHandler(rawMessage, setActiveUsers, activeUsers);
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
