import { useEffect } from 'react';

import useSignaling from '../../../../hooks/useSignaling';
import { createUserListMessage } from '../../../../helpers/Signaling/Messages';
import { useToken } from '../../../../hooks/useToken';
import UserMenu from './UserMenu';
import { useStore } from '../../../../store/Store';

export default function ActiveUsers() {
    const { signalingUrl } = useToken();
    const {
        socket: { sendJsonMessage },
    } = useSignaling({ socketUrl: signalingUrl });

    const activeUsers = useStore((state) => state.activeUsers);

    //* Request Userlist from signaling on initial component load
    useEffect(() => {
        const msg = createUserListMessage();
        sendJsonMessage(msg);
    }, []);

    return <UserMenu activeUsers={activeUsers} />;
}
