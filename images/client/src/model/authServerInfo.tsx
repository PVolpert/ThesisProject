export default interface AuthServerInfo {
    name: string;
    img: URL;
    clientID: string;
    issuer: URL;
    redirect: URL;
}

export interface RawAuthServerInfo {
    name: string;
    img: string;
    clientid: string;
    issuer: string;
    redirect: string;
}
