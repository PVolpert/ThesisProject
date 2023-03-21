// TODO Implement the Sidebar

import { generateKeyPair, IDToken } from 'oauth4webapi';
import { useRouteLoaderData } from 'react-router-dom';
import useModal from '../../../hooks/useModal';
import { useToken } from '../../../hooks/useToken';
import AuthInfoProvider from '../../../wrappers/Auth/AuthInfoProvider';
import P2PSidebarDisplay from './P2PSidebarDisplay';

/**
 * Sidebar for P2P Calls on /call Page
 * Contains
 * - Direct Call
 * - FriendsList
 * - AddAFriend
 *
 */

export interface AddAFriendModal {
    isModalShown: boolean;
    hideModal: () => void;
    showModal: () => void;
}

export default function P2PSidebar() {
    const { idToken, accessToken } = useToken({ needsToken: true });
    const authInfoProviders = useRouteLoaderData('call') as AuthInfoProvider[];
    const addAFriendModal = useModal({ shownInitial: false });

    // TODO Complete ICT Request: Read about ICT Token Flow
    async function onRequestICTHandler() {
        const keyPair = await generateKeyPair('ES384', { extractable: true });
    }

    return (
        <P2PSidebarDisplay
            onRequestICTHandler={onRequestICTHandler}
            addAFriendModal={addAFriendModal}
        />
    );
}
