import { useRouteLoaderData } from 'react-router-dom';

import OIDCProvider from '../../wrappers/Auth/OIDCProvider';
import ICTAuthItem from './ICTAuthItem';
import classes from './LoginList.module.css';
import { useZustandStore } from '../../stores/zustand/ZustandStore';

export default function ICTAuthList() {
    const ictProviders = useRouteLoaderData('call') as OIDCProvider[];
    const ictTokenMap = useZustandStore((state) => state.ictTokenMap);

    console.log(ictTokenMap);
    const items = ictProviders.map((ictProvider, index) => {
        let token = ictTokenMap.get(ictProvider.info.issuer.href);
        if (!!token) {
            return (
                <ICTAuthItem
                    key={index}
                    ictProvider={ictProvider}
                    isTokenActive={true}
                />
            );
        }
        return (
            <ICTAuthItem
                key={index}
                ictProvider={ictProvider}
                isTokenActive={false}
            />
        );
    });

    if (!items.length) {
        return <p>No valid Authentication Providers</p>;
    }

    return <ul>{items}</ul>;
}
