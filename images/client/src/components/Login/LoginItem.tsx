import { useState } from 'react';
import AuthCodeProvider from '../../wrappers/Auth/AuthCodeProvider';
import OIDCProvider from '../../wrappers/Auth/OIDCProvider';
import classes from './LoginItem.module.css';
import OIDCProviderButton from '../UI/OIDCProviderButton';

interface LoginItemProps {
    authProvider: OIDCProvider;
}

export default function LoginItem({ authProvider }: LoginItemProps) {
    const [authCodeProvider] = useState(new AuthCodeProvider(authProvider));

    return (
        <li>
            <OIDCProviderButton
                onClick={authCodeProvider.redirectToProviderHandler.bind(
                    authCodeProvider
                )}
                logo={authProvider.info.img}
                text={`Login in to ${authProvider.info.name}`}
                isTokenActive={false}
            />
        </li>
    );
}
