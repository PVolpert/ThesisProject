import { ReactNode } from 'react';
import OIDCProvider from './OIDCProvider';

export interface OIDCProviderInfo {
    name: string;
    img: ReactNode;
    clientId: string;
    issuer: URL;
    redirectId: URL;
}

const serviceProviderInfos: OIDCProviderInfo[] = [
    {
        name: 'Service',
        img: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
            </svg>
        ),
        clientId: 'thesisProject-Service',
        issuer: new URL(`${process.env.REACT_APP_OP_HOST_URL}/realms/service`),
        redirectId: new URL(
            `${process.env.REACT_APP_CLIENT_URL}/auth/redirect/dream`
        ),
    },
];

export const serviceProviders = await Promise.all(
    serviceProviderInfos.map(async (OIDCProviderInfo) => {
        return await new OIDCProvider(OIDCProviderInfo).createAuthServer();
    })
);

const ictProviderInfos: OIDCProviderInfo[] = [
    {
        name: 'ICT-Alpha',
        img: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                />
            </svg>
        ),
        clientId: 'thesisProject-ICT-Alpha',
        issuer: new URL(`${process.env.REACT_APP_OP_HOST_URL}/realms/alpha`),
        redirectId: new URL(
            `${process.env.REACT_APP_CLIENT_URL}/auth/redirect/destiny`
        ),
    },
    {
        name: 'ICT-Beta',
        img: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
            </svg>
        ),
        clientId: 'thesisProject-ICT-Beta',
        issuer: new URL(`${process.env.REACT_APP_OP_HOST_URL}/realms/beta`),
        redirectId: new URL(
            `${process.env.REACT_APP_CLIENT_URL}/auth/redirect/desire`
        ),
    },
    {
        name: 'ICT-Gamma',
        img: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                />
            </svg>
        ),
        clientId: 'thesisProject-ICT-Gamma',
        issuer: new URL(`${process.env.REACT_APP_OP_HOST_URL}/realms/gamma`),
        redirectId: new URL(
            `${process.env.REACT_APP_CLIENT_URL}/auth/redirect/delirium`
        ),
    },
];

export const ictProviders = await Promise.all(
    ictProviderInfos.map(async (OIDCProviderInfo) => {
        return await new OIDCProvider(OIDCProviderInfo).createAuthServer();
    })
);

// export async function fetchOIDCProviderInfo(apiEndpoint: string) {
//     try {
//         const respJSON = await fetch(
//             new URL(`${process.env.REACT_APP_API_URL}${apiEndpoint}`)
//         );
//         if (!respJSON.ok) {
//             throw respJSON;
//         }

//         const {
//             oidcproviderinfo: resp,
//         }: { oidcproviderinfo: RawOIDCProviderInfo[] } = await respJSON.json();

//         const oidcProviderInfos: OIDCProviderInfo[] = resp.map(
//             (rawProviderInfo) => {
//                 return {
//                     name: rawProviderInfo.name,
//                     img: new URL(rawProviderInfo.img),
//                     clientID: rawProviderInfo.clientid,
//                     issuer: new URL(rawProviderInfo.issuer),
//                     redirect: new URL(rawProviderInfo.redirect),
//                 };
//             }
//         );
//         return oidcProviderInfos;
//     } catch (error) {
//         throw error;
//     }
// }
