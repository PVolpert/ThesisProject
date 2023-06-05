import { useState } from 'react';
import AuthCodeProvider from '../../wrappers/Auth/AuthCodeProvider';
import OIDCProvider from '../../wrappers/Auth/OIDCProvider';
import classes from './LoginItem.module.css';
import OIDCProviderButton from '../UI/OIDCProviderButton';

interface LoginItemProps {
    ictProvider: OIDCProvider;
    isTokenActive: boolean;
}

export default function ICTAuthItem({
    ictProvider,
    isTokenActive,
}: LoginItemProps) {
    const [authCodeProvider] = useState(new AuthCodeProvider(ictProvider));
    if (isTokenActive) {
        return (
            <li>
                <OIDCProviderButton
                    onClick={() => {}}
                    logo={ictProvider.info.img}
                    // TODO Add username
                    text={`Connected as ${ictProvider.info.name}`}
                    isTokenActive={isTokenActive}
                />
            </li>
        );
    }
    return (
        <li>
            <OIDCProviderButton
                onClick={authCodeProvider.redirectToProviderHandler.bind(
                    authCodeProvider
                )}
                logo={ictProvider.info.img}
                text={`Connect to ${ictProvider.info.name}`}
                isTokenActive={isTokenActive}
            />
        </li>
    );
}
