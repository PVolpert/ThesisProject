import OIDCProvider from './OIDCProvider';

export default class AuthCodeProvider {
    #oidcProvider: OIDCProvider;

    #establishVerifier = () => {
        this.#oidcProvider.verifier.reset().create().store();
    };

    async #createAuthorizationURL(challenge: string): Promise<URL> {
        if (!this.#oidcProvider.authServer) {
            await this.#oidcProvider.createAuthServer();
        }

        const authorizationUrl = new URL(
            this.#oidcProvider.authServer.authorization_endpoint!
        );
        const { searchParams } = authorizationUrl;
        searchParams.set('client_id', this.#oidcProvider.client.client_id);
        searchParams.set('code_challenge', challenge);
        searchParams.set(
            'code_challenge_method',
            this.#oidcProvider.code_challenge_method
        );
        searchParams.set(
            'redirect_uri',
            this.#oidcProvider.info.redirectId.href
        );
        searchParams.set('response_type', 'code');
        searchParams.set('scope', 'openid email');

        return authorizationUrl;
    }

    // ? Show a toast
    async redirectToProviderHandler() {
        this.#establishVerifier();
        const challenge = await this.#oidcProvider.createChallenge();
        const authorizationUrl = await this.#createAuthorizationURL(challenge);

        window.location.assign(authorizationUrl);
    }

    async openNewWindowToProviderHandler() {
        this.#establishVerifier();
        const challenge = await this.#oidcProvider.createChallenge();
        const authorizationUrl = await this.#createAuthorizationURL(challenge);

        window.open(authorizationUrl);
    }

    constructor(oidcProvider: OIDCProvider) {
        this.#oidcProvider = oidcProvider;
    }
}
