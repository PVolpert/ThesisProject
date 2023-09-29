import { useState } from 'react';
import AuthCodeProvider from '../../../helpers/Auth/AuthCodeProvider';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import OIDCProviderButton from '../../UI/OIDCProviderButton';
import { IDToken } from 'oauth4webapi';
import { useStore } from '../../../store/Store';

interface LoginItemProps {
    ictProvider: OIDCProvider;
    IdToken?: IDToken;
}

export default function ICTAuthItem({ ictProvider, IdToken }: LoginItemProps) {
    const [authCodeProvider] = useState(new AuthCodeProvider(ictProvider));
    const parseICT = useStore((state) => state.parseICT);

    window.onmessage = (ev) => {
        try {
            const parsedData = JSON.parse(ev.data);
            const { type = '', data = {} } = parsedData;
            if (type === 'OIDCtokens') {
                parseICT(data);
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Handle syntax errors separately (if needed)
                return;
                // You can choose to ignore syntax errors or take specific action
            } else {
                console.log(error);
            }
        }
    };

    if (IdToken) {
        return (
            <li>
                <OIDCProviderButton
                    onClick={() => {}}
                    logo={ictProvider.info.img}
                    text={`Connected as ${IdToken.name?.toString()}`}
                    isTokenActive={!!IdToken}
                />
            </li>
        );
    }

    return (
        <li>
            <OIDCProviderButton
                onClick={() => {
                    authCodeProvider.openNewWindowToProviderHandler();
                }}
                logo={ictProvider.info.img}
                text={`Connect to ${ictProvider.info.name}`}
                isTokenActive={!!IdToken}
            />
        </li>
    );
}
