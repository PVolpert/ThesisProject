// TODO Implement the Sidebar

import { generateKeyPair, IDToken } from 'oauth4webapi';
import { useRouteLoaderData } from 'react-router-dom';
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

export default function P2PSidebar() {
    const { idToken, accessToken } = useToken({ needsToken: true });
    const authInfoProviders = useRouteLoaderData('call') as AuthInfoProvider[];

    async function onRequestIATHandler() {
        const keyPair = await generateKeyPair('ES384', { extractable: true });
    }

    return <P2PSidebarDisplay onRequestIATHandler={onRequestIATHandler} />;
}
