import { useRouteLoaderData } from 'react-router-dom';

import AuthInfoProvider from '../../wrappers/Auth/AuthInfoProvider';
import LoginItem from './LoginItem';
import classes from './LoginList.module.css';

export default function LoginList() {
    const authInfoProviders = useRouteLoaderData('auth') as AuthInfoProvider[];

    const items = authInfoProviders.map((authInfoProvider, index) => (
        <LoginItem key={index} authInfoProvider={authInfoProvider} />
    ));

    return <ul>{items}</ul>;
}
