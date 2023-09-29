import {
    expectNoState,
    validateAuthResponse,
    isOAuth2Error,
    authorizationCodeGrantRequest,
    parseWwwAuthenticateChallenges,
    WWWAuthenticateChallenge,
    processAuthorizationCodeOpenIDResponse,
    OpenIDTokenEndpointResponse,
} from 'oauth4webapi';

import OIDCProvider from './OIDCProvider';

/*
 * The AuthCodeConsumer class is a wrapper for the second part of an Authentication Code Flow using oauth4webapi
 * Specifically AuthCodeConsumer wraps:
 * - verifying the Auth Code Response
 * - extracting the relevant information from the Auth Code response
 * - requesting the Token
 * - verifying the Token Response
 * - extracting the relevant information from the Token Response
 * To use a more SOLID approach I split the AuthCodeConsumer Class into 3 Subclasses
 * Oauth4WebApiWrapper: Wraps oauth4webapis function params using variables from the Provider Class
 * Consumption Steps: Combines the wrapped functions with verification to make actual steps
 * AuthCodeConsumer: Arranges the consumption steps in correct order
 *
 */

class Oauth4WebApiWrapper {
    #oidcProvider: OIDCProvider;
    #searchParams: URLSearchParams;

    async validateAuthResponse() {
        const params = validateAuthResponse(
            this.#oidcProvider.authServer,
            this.#oidcProvider.client,
            this.#searchParams,
            expectNoState
        );
        return params;
    }

    // ! Normal Import of oauth4webapi does not export CallbackParameters therefore we need any
    async authorizationCodeGrantRequest(params: any) {
        if (!this.#oidcProvider.verifier.verifier) {
            throw new Response(
                JSON.stringify({
                    message: 'No verifier set',
                }),
                { status: 400 }
            );
        }

        const response = authorizationCodeGrantRequest(
            this.#oidcProvider.authServer,
            this.#oidcProvider.client,
            params,
            this.#oidcProvider.info.redirectId.href,
            this.#oidcProvider.verifier.verifier
        );
        return response;
    }

    async processAuthorizationCodeOpenIDResponse(response: Response) {
        const result = processAuthorizationCodeOpenIDResponse(
            this.#oidcProvider.authServer,
            this.#oidcProvider.client,
            response
        );
        return result;
    }

    constructor(oidcProvider: OIDCProvider, params: URLSearchParams) {
        if (!oidcProvider.authServer || !oidcProvider.client) {
            throw new Response(
                JSON.stringify({
                    message: 'oidcProvider values not set',
                }),
                { status: 400 }
            );
        }
        this.#oidcProvider = oidcProvider;

        if (!params) {
            throw new Response(
                JSON.stringify({
                    message: 'No search params entered',
                }),
                { status: 400 }
            );
        }
        this.#searchParams = params;
    }
}

class ConsumptionSteps extends Oauth4WebApiWrapper {
    async getAuthCode() {
        const callBackParams = await this.validateAuthResponse();
        if (isOAuth2Error(callBackParams)) {
            throw new Response(
                JSON.stringify({
                    message: 'Something went wrong during login',
                    oauthError: callBackParams,
                }),
                { status: 500 }
            );
        }
        return callBackParams;
    }

    // ! Normal Import of oauth4webapi does not export CallbackParameters therefore we need any
    async getAuthCodeGrantResponse(callBackParams: any) {
        const authCodeGrantResponse = await this.authorizationCodeGrantRequest(
            callBackParams
        );
        let challenges: WWWAuthenticateChallenge[] | undefined;
        if (
            (challenges = parseWwwAuthenticateChallenges(authCodeGrantResponse))
        ) {
            for (const challenge of challenges) {
                console.log('challenge', challenge);
            }
            throw new Response(
                JSON.stringify({
                    message: 'Contains www-authenticate challenges',
                }),
                { status: 500 }
            );
            // Handle www-authenticate challenges as needed
        }
        return authCodeGrantResponse;
    }

    async getProcessedGrantResponse(authCodeGrantResponse: Response) {
        const processedTokenResponse =
            await this.processAuthorizationCodeOpenIDResponse(
                authCodeGrantResponse
            );
        if (isOAuth2Error(processedTokenResponse)) {
            // Handle OAuth 2.0 response body error
            throw new Response(
                JSON.stringify({
                    message: 'Something went wrong during backchannel request',
                    oauthError: processedTokenResponse,
                }),
                { status: 500 }
            );
        }
        return processedTokenResponse;
    }
}

class AuthCodeConsumer extends ConsumptionSteps {
    tokenResponse: OpenIDTokenEndpointResponse | null;

    async fetchTokenEndPointResponse() {
        const callBackParams = await this.getAuthCode();

        const authCodeGrantResponse = await this.getAuthCodeGrantResponse(
            callBackParams
        );

        const processedTokenResponse = await this.getProcessedGrantResponse(
            authCodeGrantResponse
        );
        this.tokenResponse = processedTokenResponse;
    }

    constructor(authProvider: OIDCProvider, params: URLSearchParams) {
        super(authProvider, params);
        this.tokenResponse = null;
    }
}

export async function fetchTokenEndPointResponse(
    oidcProvider: OIDCProvider,
    searchParams: URLSearchParams
) {
    // Load Verifier
    oidcProvider.verifier.load();

    const authCodeConsumer = new AuthCodeConsumer(oidcProvider, searchParams);
    await authCodeConsumer.fetchTokenEndPointResponse();
    if (!authCodeConsumer.tokenResponse) {
        throw new Response(
            JSON.stringify({
                message: 'backchannel response does not contain a token',
            }),
            { status: 500 }
        );
    }
    // Delete verifier after successful
    oidcProvider.verifier.reset();
    return authCodeConsumer.tokenResponse;
}
