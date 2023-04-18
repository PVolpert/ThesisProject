import { useRouteLoaderData } from 'react-router-dom';

import OIDCProvider from '../../wrappers/Auth/OIDCProvider';
import LoginItem from './LoginItem';
import classes from './LoginList.module.css';

export default function LoginList() {
    const authProviders = useRouteLoaderData('auth') as OIDCProvider[];

    const items = authProviders.map((authProvider, index) => (
        <LoginItem key={index} authProvider={authProvider} />
    ));

    if (!items.length) {
        return <p>No valid Authentication Providers</p>;
    }

    return <ul>{items}</ul>;
}
