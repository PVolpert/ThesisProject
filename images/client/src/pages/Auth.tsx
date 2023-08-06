import { fetchOIDCProviderInfo } from '../helpers/Auth/OIDCProviderInfo';
import OIDCProvider from '../helpers/Auth/OIDCProvider';

export async function loader() {
    //? Caching via Service Worker would be a good idea
    const authProviderInfos = await fetchOIDCProviderInfo('/authProviderInfo');

    // Transform into wrapper
    const authProviders = authProviderInfos.map(
        (oidcProvider) => new OIDCProvider(oidcProvider)
    );

    return authProviders;
}
