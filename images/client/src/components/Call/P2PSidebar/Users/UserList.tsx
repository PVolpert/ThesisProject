import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FriendItem from './UserItem';
import useSignaling from '../../../../hooks/useSignaling';
import { useZustandStore } from '../../../../stores/zustand/ZustandStore';
import { UserId, UserInfo } from '../../../../wrappers/Signaling/User';
import {
    Message,
    createUserListMessage,
} from '../../../../wrappers/Signaling/Messages';
import {
    incomingUserListHandler,
    incomingUserOfflineHandler,
    incomingUserOnlineHandler,
} from '../../../../wrappers/Signaling/MessageHandlers';
import { useToken } from '../../../../hooks/useToken';

export default function UserList() {
    const { idToken, signalingUrl } = useToken();
    const {
        socket: { lastJsonMessage, sendJsonMessage },
    } = useSignaling({ socketUrl: signalingUrl });

    const [userList, setUserList] = useState<UserInfo[]>([]);

    // Zustand Store Access
    const setTarget = useZustandStore((state) => {
        return state.setTarget;
    });

    const navigate = useNavigate();

    // * Effect for Outgoing Socket Message
    useEffect(() => {
        const msg = createUserListMessage();
        sendJsonMessage(msg);
    }, [sendJsonMessage]);

    // * Effect for Incoming Socket Message
    useEffect(() => {
        if (!lastJsonMessage || !idToken) {
            return;
        }
        const { type } = lastJsonMessage as Message;
        if (!type) {
            console.error('Missing socket message type');
            return;
        }
        switch (type) {
            case 'userList':
                incomingUserListHandler(lastJsonMessage, setUserList, idToken);
                break;
            case 'userOnline':
                incomingUserOnlineHandler(
                    lastJsonMessage,
                    setUserList,
                    idToken
                );
                break;
            case 'userOffline':
                incomingUserOfflineHandler(lastJsonMessage, setUserList);
                break;
        }
    }, [lastJsonMessage]);

    const onCallHandlerBuilder = useCallback(
        (target: UserId) => {
            const onCallHandler = () => {
                setTarget(target);
                navigate('/call/p2p');
            };
            return onCallHandler;
        },
        [navigate, setTarget]
    );
    const items = userList.map((user) => {
        return (
            <FriendItem
                key={user.issuer + user.subject}
                userName={user.username}
                callFct={onCallHandlerBuilder(user)}
            />
        );
    });

    if (items.length === 0) {
        return <p>No active users :/</p>;
    }

    return <ul>{items}</ul>;
}
