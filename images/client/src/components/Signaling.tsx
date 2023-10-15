import useSignaling from '../hooks/useSignaling';
import { useEffect } from 'react';

import { useStore } from '../store/Store';
import { useToken } from '../hooks/useToken';
import { globalMessageHandler } from '../helpers/Signaling/MessageHandlers';

export default function Signaling() {
    const { signalingUrl, idToken } = useToken();
    const {
        socket: { lastJsonMessage, readyState },
    } = useSignaling({ socketUrl: signalingUrl });

    const showIncomingCallModal = useStore(
        (state) => state.showIncomingCallModal
    );
    const setSignalingConnectionState = useStore(
        (state) => state.setSignalingConnectionState
    );

    const setActiveUsers = useStore((state) => state.setActiveUsers);
    const activeUsers = useStore((state) => state.activeUsers);

    const setCaller = useStore((state) => state.setCaller);
    const setType = useStore((state) => state.setType);

    useEffect(() => {
        // Update store value of ready state
        setSignalingConnectionState(readyState);
    }, [readyState]);

    //* Handle incoming websocket messages of type call offer
    useEffect(() => {
        if (!idToken || !lastJsonMessage || !idToken['preferred_username']) {
            return;
        }

        globalMessageHandler(
            lastJsonMessage,
            activeUsers,
            { username: idToken['preferred_username'] as string },
            setActiveUsers,
            setCaller,
            setType,
            showIncomingCallModal
        );
    }, [lastJsonMessage]);

    return <></>;
}
