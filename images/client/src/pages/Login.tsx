import AuthWidget from '../components/Auth/AuthWidget';
import { useToken } from '../hooks/useToken';

export default function LoginPage() {
    useToken({ needsToken: false });
    return <AuthWidget />;
}
