import { useRouteLoaderData } from 'react-router-dom';

import OIDCProvider from '../../helpers/Auth/OIDCProvider';
import LoginItem from './LoginItem';

export default function LoginList() {
    const authProviders = useRouteLoaderData('auth') as OIDCProvider[];

    const items = authProviders.map((authProvider, index) => (
        <LoginItem key={index} authProvider={authProvider} />
    ));

    if (!items.length) {
        return <p>No valid Authentication Providers</p>;
    }

    return <ul className="flex flex-col space-y-6">{items}</ul>;
}
