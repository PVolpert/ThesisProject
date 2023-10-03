import { CallDisplay } from '../components/Call/CallDisplay';
import { useToken } from '../hooks/useToken';

export default function CallPage() {
    useToken({ needsToken: true });
    return <CallDisplay />;
}
