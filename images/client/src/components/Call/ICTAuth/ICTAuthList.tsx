import { useRouteLoaderData } from 'react-router-dom';

import OIDCProvider from '../../../wrappers/Auth/OIDCProvider';
import ICTAuthItem from './ICTAuthItem';
import classes from './LoginList.module.css';
import { useZustandStore } from '../../../stores/zustand/ZustandStore';

export default function ICTAuthList() {
    const ictProviders = useRouteLoaderData('call') as OIDCProvider[];
    const ictTokens = useZustandStore((state) => state.ictTokens);
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
        <div className="flex flex-auto">
            <p>ICT Provider List</p>
            <ul>{items}</ul>
        </div>
    );
}
