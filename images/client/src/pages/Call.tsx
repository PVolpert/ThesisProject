import { CallDisplay } from '../components/Call/CallDisplay';
import Conference from '../components/Call/Conference/Conference';
import P2PSidebar from '../components/Call/P2PSidebar/P2PSidebar';
import { useToken } from '../hooks/useToken';
import OIDCProvider from '../wrappers/Auth/OIDCProvider';
import { fetchOIDCProviderInfo } from '../wrappers/Auth/OIDCProviderInfo';

export default function CallPage() {
    useToken({ needsToken: true });
    return <CallDisplay />;
}

export async function loader() {
    //? Caching via Service Worker would be a good idea
    const ictProviderInfos = await fetchOIDCProviderInfo('/ictProviderInfo');

    // Transform into wrapper
    const ictProviders = ictProviderInfos.map(
        (oidcProvider) => new OIDCProvider(oidcProvider)
    );
    return ictProviders;
}
