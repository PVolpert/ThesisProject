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
            <OIDCProviderButton
                id={ictProvider.info.name}
                onClick={() => {}}
                logo={ictProvider.info.img}
                text={`Added ${ictProvider.info.name}`}
                isTokenActive={isTokenActive}
            />
        );
    }
    return (
        <OIDCProviderButton
            id={ictProvider.info.name}
            onClick={authCodeProvider.redirectToProviderHandler.bind(
                authCodeProvider
            )}
            logo={ictProvider.info.img}
            text={`Add ${ictProvider.info.name}`}
            isTokenActive={isTokenActive}
        />
    );
}
