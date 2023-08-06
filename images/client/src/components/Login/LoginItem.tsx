import { useState } from 'react';
import AuthCodeProvider from '../../helpers/Auth/AuthCodeProvider';
import OIDCProvider from '../../helpers/Auth/OIDCProvider';

import OIDCProviderButton from '../UI/OIDCProviderButton';

interface LoginItemProps {
    authProvider: OIDCProvider;
}

export default function LoginItem({ authProvider }: LoginItemProps) {
    const [authCodeProvider] = useState(new AuthCodeProvider(authProvider));

    return (
        <li>
            <OIDCProviderButton
                onClick={() => authCodeProvider.redirectToProviderHandler()}
                logo={authProvider.info.img}
                text={`Login in with ${authProvider.info.name}`}
            />
        </li>
    );
}
