import { useRouteLoaderData } from 'react-router-dom';
import AuthInfoProvider from '../../wrappers/Auth/AuthInfoProvider';
import AuthItem from './AuthItem';

export default function AuthList() {
    const authServers = useRouteLoaderData('auth') as AuthInfoProvider[];

    const items = authServers.map((authProvider, index) => (
        <AuthItem key={index} authProvider={authProvider} />
    ));

    return <ul>{items}</ul>;
}
