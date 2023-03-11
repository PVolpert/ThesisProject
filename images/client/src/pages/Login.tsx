import AuthWidget from '../components/Auth/AuthWidget';
import { useNeedsToken } from '../hooks/useNeedsToken';

export default function LoginPage() {
    useNeedsToken(false);
    return <AuthWidget />;
}
