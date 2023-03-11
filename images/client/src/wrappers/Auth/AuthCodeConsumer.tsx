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

import AuthInfoProvider from './AuthInfoProvider';

/*
! Key method : AuthCodeConsumers handleAuthCode()
! Key property: AuthCodeConsumers tokenResponse
 * The AuthCodeConsumer class is a wrapper for the second part of an Authentication Code Flow using oauth4webapi
 * Specifically AuthCodeConsumer wraps:
 * - verifying the Auth Code Response
 * - extracting the relevant information from the Auth Code response
 * - requesting the Token
 * - verifying the Token Response
 * - extracting the relevant information from the Token Response
 * To use a more SOLID approach I split the AuthCodeConsumer Class into 3 Subclasses
 * Consumption steps: Wraps oauth4webapis function params with the AuthInfoProvider Class
 * Consumption verification: Adds the verification to each wrapped step
 * AuthCodeConsumer: Arranges the verified functions so that only handleAuthCode has to be executed from the outside 
 */

class ConsumptionSteps {
    #authProvider: AuthInfoProvider;
    #searchParams: URLSearchParams;

    async validateAuthResponse() {
        const params = validateAuthResponse(
            this.#authProvider.authServer,
            this.#authProvider.client,
            this.#searchParams,
            expectNoState
        );
        return params;
    }

    // ! Normal Import of oauth4webapi does not export CallbackParameters therefore we need any
    async authorizationCodeGrantRequest(params: any) {
        if (!this.#authProvider.verifier.verifier) {
            throw new Response(
                JSON.stringify({
                    message: 'No verifier set',
                }),
                { status: 400 }
            );
        }

        const response = authorizationCodeGrantRequest(
            this.#authProvider.authServer,
            this.#authProvider.client,
            params,
            this.#authProvider.info.redirect.href,
            this.#authProvider.verifier.verifier
        );
        return response;
    }

    async processAuthorizationCodeOpenIDResponse(response: Response) {
        const result = processAuthorizationCodeOpenIDResponse(
            this.#authProvider.authServer,
            this.#authProvider.client,
            response
        );
        return result;
    }

    constructor(authProvider: AuthInfoProvider, params: URLSearchParams) {
        if (!authProvider.authServer || !authProvider.client) {
            throw new Response(
                JSON.stringify({
                    message: 'authProvider values not set',
                }),
                { status: 400 }
            );
        }
        this.#authProvider = authProvider;

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

class ConsumptionVerification extends ConsumptionSteps {
    async validateAuthCode() {
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
    async requestToken(callBackParams: any) {
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

    async processTokenResponse(authCodeGrantResponse: Response) {
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

export default class AuthCodeConsumer extends ConsumptionVerification {
    tokenResponse: OpenIDTokenEndpointResponse | null;
    async fetchTokenEndPointResponse() {
        const callBackParams = await this.validateAuthCode();

        const authCodeGrantResponse = await this.requestToken(callBackParams);

        const processedTokenResponse = await this.processTokenResponse(
            authCodeGrantResponse
        );
        this.tokenResponse = processedTokenResponse;
    }

    constructor(authProvider: AuthInfoProvider, params: URLSearchParams) {
        super(authProvider, params);
        this.tokenResponse = null;
    }
}
