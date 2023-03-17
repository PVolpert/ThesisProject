import AuthServerInfo from '../model/authServerInfo';
import authServerInfo, { RawAuthServerInfo } from '../model/authServerInfo';
import AuthInfoProvider from '../wrappers/Auth/AuthInfoProvider';

const DUMMY_AUTHSERVERS: authServerInfo[] = [
    {
        name: 'Keycloak',
        img: new URL('https://www.svgrepo.com/download/331455/keycloak.svg'),
        clientID: 'demoReact',
        issuer: new URL('http://op.localhost/realms/iat'),
        redirect: new URL('http://localhost:2000/auth/redirect/destiny'),
    },
];

export async function loader() {
    // Fetch AuthServers if not already existing
    let authServerInfo;
    if (!authServerInfo) {
        authServerInfo = await fetchAuthServers();
    }

    // Transform into wrapper
    const authProviders = authServerInfo.map((authServer) => {
        const verifierStorageName = authServer.name + 'verifier';
        return new AuthInfoProvider(verifierStorageName, authServer);
    });
    return authProviders;
}

async function fetchAuthServers() {
    try {
        const respJSON = await fetch(
            new URL(`${process.env.REACT_APP_PROXY_URL}/api/authServerInfo`)
        );
        if (!respJSON.ok) {
            throw new Error(`${respJSON.status}: ${respJSON.statusText}`);
        }

        const resp: RawAuthServerInfo[] = await respJSON.json();
        const authServerInfo: AuthServerInfo[] = resp.map((authServer) => {
            return {
                name: authServer.name,
                img: new URL(authServer.img),
                clientID: authServer.clientid,
                issuer: new URL(authServer.issuer),
                redirect: new URL(authServer.redirect),
            };
        });
        return authServerInfo;
    } catch (error) {
        console.log(error);
        return DUMMY_AUTHSERVERS;
    }
}
