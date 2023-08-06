import LoginPageDisplay from '../components/Login/LoginPageDisplay';
import { useToken } from '../hooks/useToken';

export default function LoginPage() {
    useToken({ needsToken: false });
    return <LoginPageDisplay />;
}
