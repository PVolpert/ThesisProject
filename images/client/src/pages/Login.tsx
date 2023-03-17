import LoginDisplay from '../components/Login/LoginDisplay';
import { useToken } from '../hooks/useToken';

export default function LoginPage() {
    useToken({ needsToken: false });
    return <LoginDisplay />;
}
