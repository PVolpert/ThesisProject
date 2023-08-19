import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignaling from '../../../../hooks/useSignaling';
import { useStore } from '../../../../store/Store';
import { UserInfo } from '../../../../helpers/Signaling/User';
import {
    Message,
    createUserListMessage,
} from '../../../../helpers/Signaling/Messages';
import {
    incomingUserListHandler,
    incomingUserOfflineHandler,
    incomingUserOnlineHandler,
} from '../../../../helpers/Signaling/MessageHandlers';
import { useToken } from '../../../../hooks/useToken';
import UserListDisplay from './UserListDisplay';

export default function UserList() {
    //Constant definitions
    const { idToken, signalingUrl } = useToken();
    const {
        socket: { lastJsonMessage, sendJsonMessage },
    } = useSignaling({ socketUrl: signalingUrl });

    const [userList, setUserList] = useState<UserInfo[]>([]);

    // Zustand Store Access
    const setCallPartner = useStore((state) => {
        return state.setCallPartner;
    });
    const setCalleeUserName = useStore((state) => state.setCalleeUserName);

    const showOutgoingCallModal = useStore((state) => {
        return state.showOutgoingCallModal;
    });
    const resetOutgoingCall = useStore((state) => {
        return state.resetOutgoingCallSlice;
    });

    const navigate = useNavigate();

    //
    const onCallHandlerBuilder = useCallback(
        (callee: UserInfo) => {
            const onCallHandler = () => {
                setCallPartner(callee);
                resetOutgoingCall();
                setCalleeUserName(callee.username);

                showOutgoingCallModal();
            };
            return onCallHandler;
        },
        [navigate, setCallPartner]
    );

    //! Socket side-effects

    //* Request Userlist from signaling on initial component load
    useEffect(() => {
        const msg = createUserListMessage();
        sendJsonMessage(msg);
    }, []);

    //* Handle incoming user-type messages
    useEffect(() => {
        // Ignore empty lastJSONMessage & missing login
        if (!lastJsonMessage || !idToken) {
            return;
        }
        const handleUserMessages = async () => {
            // Parse the message type
            const { type } = lastJsonMessage as Message;
            if (!type) {
                console.error('Missing socket message type');
                return;
            }
            switch (type) {
                case 'userList':
                    incomingUserListHandler(
                        lastJsonMessage,
                        setUserList,
                        idToken
                    );
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
        };
        handleUserMessages();
    }, [lastJsonMessage]);

    return (
        <UserListDisplay
            userList={userList}
            onCallHandlerBuilder={onCallHandlerBuilder}
        />
    );
}
