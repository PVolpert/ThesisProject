import { fetchOIDCProviderInfo } from '../wrappers/Auth/OIDCProviderInfo';
import OIDCProvider from '../wrappers/Auth/OIDCProvider';

export async function loader() {
    //? Caching via Service Worker would be a good idea
    const authProviderInfos = await fetchOIDCProviderInfo('/api/authProviderInfo');

    // Transform into wrapper
    const authProviders = authProviderInfos.map(
        (oidcProvider) => new OIDCProvider(oidcProvider)
    );
    return authProviders;
}
