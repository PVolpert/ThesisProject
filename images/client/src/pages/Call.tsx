import { CallDisplay } from '../components/Call/CallDisplay';
import { useToken } from '../hooks/useToken';
// import OIDCProvider from '../helpers/Auth/OIDCProvider';
// import { fetchOIDCProviderInfo } from '../helpers/Auth/OIDCProviderInfo';

export default function CallPage() {
    useToken({ needsToken: true });
    return <CallDisplay />;
}

// export async function loader() {
//     //? Caching via Service Worker would be a good idea
//     const ictProviderInfos = await fetchOIDCProviderInfo('/ictProviderInfo');

//     // Transform into wrapper
//     const ictProviders = ictProviderInfos.map(
//         (oidcProvider) => new OIDCProvider(oidcProvider)
//     );
//     return ictProviders;
// }
