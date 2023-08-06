export interface OIDCProviderInfo {
    name: string;
    img: URL;
    clientID: string;
    issuer: URL;
    redirect: URL;
}

export interface RawOIDCProviderInfo {
    name: string;
    img: string;
    clientid: string;
    issuer: string;
    redirect: string;
}

export async function fetchOIDCProviderInfo(apiEndpoint: string) {
    try {
        const respJSON = await fetch(
            new URL(`${process.env.REACT_APP_API_URL}${apiEndpoint}`)
        );
        if (!respJSON.ok) {
            throw respJSON;
        }

        const {
            oidcproviderinfo: resp,
        }: { oidcproviderinfo: RawOIDCProviderInfo[] } = await respJSON.json();

        const oidcProviderInfos: OIDCProviderInfo[] = resp.map(
            (rawProviderInfo) => {
                return {
                    name: rawProviderInfo.name,
                    img: new URL(rawProviderInfo.img),
                    clientID: rawProviderInfo.clientid,
                    issuer: new URL(rawProviderInfo.issuer),
                    redirect: new URL(rawProviderInfo.redirect),
                };
            }
        );
        return oidcProviderInfos;
    } catch (error) {
        throw error;
    }
}
