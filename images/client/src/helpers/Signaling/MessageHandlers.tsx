import { incomingUserListMessage, incomingUserStateMessage } from './Messages';
import { UserId, isUserEqual } from './User';
import {
    isIncomingMessage,
    isIncomingUserListMessage,
    isIncomingUserStateMessage,
    isOriginMessage,
} from './MessageChecker';

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
