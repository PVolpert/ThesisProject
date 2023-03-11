import Videos from '../components/Video/Videos';
import { useNeedsToken } from '../hooks/useNeedsToken';

export default function CallPage() {
    useNeedsToken(true);
    return <Videos />;
}
