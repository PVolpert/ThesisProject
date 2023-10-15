import { ReactNode } from 'react';
import OIDCProvider from '../Auth/OIDCProvider';

export interface ICTProviderInfo {
    name: string;
    issuer: string;
    ictURI: string;
    clientID: string;
    img: ReactNode;
}

export function convertToICTProvider(oidcProvider: OIDCProvider) {
    const jwks_uri = oidcProvider.authServer.jwks_uri;

    if (!jwks_uri) {
        throw Error('oidcProvider does not contain jwks Endpoint');
    }

    const newOpenIDProviderInfo: ICTProviderInfo = {
        name: oidcProvider.info.name,
        issuer: oidcProvider.info.issuer.href,
        ictURI: jwks_uri,
        clientID: oidcProvider.info.clientId,
        img: oidcProvider.info.img,
    };

    return newOpenIDProviderInfo;
}
