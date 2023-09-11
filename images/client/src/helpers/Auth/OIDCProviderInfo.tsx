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
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
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
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
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
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
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
