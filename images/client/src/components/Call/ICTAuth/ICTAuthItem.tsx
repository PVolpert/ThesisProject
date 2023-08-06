import { useState } from 'react';
import AuthCodeProvider from '../../../helpers/Auth/AuthCodeProvider';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import OIDCProviderButton from '../../UI/OIDCProviderButton';
import { IDToken } from 'oauth4webapi';

interface LoginItemProps {
    ictProvider: OIDCProvider;
    IdToken?: IDToken;
}

export default function ICTAuthItem({ ictProvider, IdToken }: LoginItemProps) {
    const [authCodeProvider] = useState(new AuthCodeProvider(ictProvider));
    if (IdToken) {
        return (
            <li>
                <OIDCProviderButton
                    onClick={() => {}}
                    logo={ictProvider.info.img}
                    // TODO Add username
                    text={`Connected as ${IdToken.name?.toString()}`}
                    isTokenActive={!!IdToken}
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
                isTokenActive={!!IdToken}
            />
        </li>
    );
}
