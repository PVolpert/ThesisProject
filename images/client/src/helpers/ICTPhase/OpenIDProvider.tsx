import OIDCProvider from '../Auth/OIDCProvider';

export interface OpenIDProviderInfo {
    name: string;
    issuer: string;
    jwksURI: string;
    clientID: string;
}

export function convertOIDCProvider(oidcProvider: OIDCProvider) {
    const jwks_uri = oidcProvider.authServer.jwks_uri;

    if (!jwks_uri) {
        throw Error('oidcProvider does not contain jwks Endpoint');
    }

    const newOpenIDProviderInfo: OpenIDProviderInfo = {
        name: oidcProvider.info.name,
        issuer: oidcProvider.info.issuer.href,
        jwksURI: jwks_uri,
        clientID: oidcProvider.info.clientId,
    };

    return newOpenIDProviderInfo;
}
