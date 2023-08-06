import { useRouteLoaderData } from 'react-router-dom';

import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import ICTAuthItem from './ICTAuthItem';
import { useStore } from '../../../store/Store';
import { Description, MainTitle } from '../../UI/Headers';

export default function ICTAuthList() {
    const ictProviders = useRouteLoaderData('call') as OIDCProvider[];
    const ictTokens = useStore((state) => state.ictTokens);
    const items = ictProviders.map((ictProvider, index) => {
        let token = ictTokens.find((ictToken) => {
            return ictToken.idToken.iss == ictProvider.info.issuer.href;
        });
        if (!!token) {
            return (
                <ICTAuthItem
                    key={index}
                    ictProvider={ictProvider}
                    IdToken={token.idToken}
                />
            );
        }
        return <ICTAuthItem key={index} ictProvider={ictProvider} />;
    });

    if (!items.length) {
        return <p>No valid Authentication Providers</p>;
    }

    return (
        <div className="flex flex-col space-y-2 p-4 md:self-center">
            <MainTitle>Call Identity</MainTitle>
            <Description>
                Log in to one or more call identity provider
            </Description>
            <ul>{items}</ul>
            {/* Background whirls here */}
        </div>
    );
}
