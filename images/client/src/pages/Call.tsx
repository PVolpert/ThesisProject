import { CallDisplay } from '../components/Call/CallDisplay';
import Conference from '../components/Call/Conference/Conference';
import P2PSidebar from '../components/Call/P2PSidebar/P2PSidebar';
import { useToken } from '../hooks/useToken';
import { loader as authInfoLoader } from './Auth';

export default function CallPage() {
    useToken({ needsToken: true });
    return <CallDisplay />;
}

export async function loader() {
    return authInfoLoader();
    // ? Include fetch friends here
}
