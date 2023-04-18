import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAccessTokenSlice, AccessTokenSlice } from './AccessTokenSlice';
import { CallOptionsSlice, createCallOptionsSlice } from './CallOptionsSlice';
import {
    ICTAccessTokenSlice,
    createICTAccessTokenSlice,
} from './ICTAccessTokenSlice';

export const useZustandStore = create<
    CallOptionsSlice & AccessTokenSlice & ICTAccessTokenSlice
>()(
    persist(
        (...a) => ({
            ...createAccessTokenSlice(...a),
            ...createCallOptionsSlice(...a),
            ...createICTAccessTokenSlice(...a),
        }),
        {
            name: 'token-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                idToken: state.idToken,
                // ictTokenMap: state.ictTokenMap,
            }),
        }
    )
);

// ! From here legacy code starts
// ! Works but does not reflect React State Changes
// ! Stays to showcase work with singletons and storage
/*
 * Singleton Classes AccessToken & OpenIDToken
 * Persists route traversals
 * load is handled individually
 * store&parse&reset are handled together (individual might lead to deviating Tokens)
 */
// const accessStorageName = 'accessToken';
// const idStorageName = 'idToken';
// export class AccessToken {
//     #accessToken: string | null;

//     static #instance: AccessToken;

//     static getInstance() {
//         if (!AccessToken.#instance) {
//             AccessToken.#instance = new AccessToken();
//         }
//         return AccessToken.#instance;
//     }

//     resetAccessToken() {
//         this.#accessToken = null;
//         return this;
//     }

//     public get accessToken(): string | null {
//         return this.#accessToken;
//     }

//     public set accessToken(newToken) {
//         if (this.#accessToken) {
//             throw new Response(
//                 JSON.stringify({
//                     message: 'access token is already set',
//                 }),
//                 { status: 400 }
//             );
//         }
//         if (!newToken) {
//             throw new Response(
//                 JSON.stringify({
//                     message: 'input must be a string',
//                 }),
//                 { status: 400 }
//             );
//         }
//         this.#accessToken = newToken;
//     }

//     constructor() {
//         this.#accessToken = null;
//     }
// }

// export class OpenIDToken {
//     #idToken: IDToken | null;

//     static #instance: OpenIDToken;

//     static getInstance() {
//         if (!OpenIDToken.#instance) {
//             OpenIDToken.#instance = new OpenIDToken();
//         }
//         return OpenIDToken.#instance;
//     }

//     resetIdToken() {
//         this.#idToken = null;
//         return this;
//     }
//     public get idToken(): IDToken | null {
//         return this.#idToken;
//     }

//     public set idToken(newToken) {
//         if (this.#idToken) {
//             throw new Response(
//                 JSON.stringify({
//                     message: 'id token is already set',
//                 }),
//                 { status: 400 }
//             );
//         }
//         if (!newToken) {
//             throw new Response(
//                 JSON.stringify({
//                     message: 'input must be a string',
//                 }),
//                 { status: 400 }
//             );
//         }
//         this.#idToken = newToken;
//     }
//     constructor() {
//         this.#idToken = null;
//     }
// }

// export function parseTokens(response: OpenIDTokenEndpointResponse) {
//     function parseAccessToken() {
//         const { access_token: accessToken } = response;
//         const newAccessToken = AccessToken.getInstance();
//         newAccessToken.accessToken = accessToken;
//         return newAccessToken;
//     }
//     function parseIDToken() {
//         const idToken = getValidatedIdTokenClaims(response);
//         const newIDToken = OpenIDToken.getInstance();
//         newIDToken.idToken = idToken;
//         return newIDToken;
//     }
//     return {
//         accessToken: parseAccessToken(),
//         idToken: parseIDToken(),
//     };
// }

// interface tokens {
//     accessToken: AccessToken;
//     idToken: OpenIDToken;
// }

// export function storeTokens({ accessToken, idToken }: tokens) {
//     function storeAccessToken() {
//         if (localStorage.getItem(accessStorageName)) {
//             throw new Response(
//                 JSON.stringify({
//                     message: 'access token already stored',
//                 }),
//                 { status: 400 }
//             );
//         }
//         if (!accessToken.accessToken) {
//             throw new Response(
//                 JSON.stringify({
//                     message: 'No access token available, please parse or load',
//                 }),
//                 { status: 400 }
//             );
//         }
//         localStorage.setItem(accessStorageName, accessToken.accessToken);
//     }

//     function storeIDToken() {
//         if (localStorage.getItem(idStorageName)) {
//             throw new Response(
//                 JSON.stringify({
//                     message: 'id token already stored',
//                 }),
//                 { status: 400 }
//             );
//         }
//         if (!idToken.idToken) {
//             throw new Response(
//                 JSON.stringify({
//                     message: 'No id token available, please parse or load',
//                 }),
//                 { status: 400 }
//             );
//         }
//         localStorage.setItem(idStorageName, JSON.stringify(idToken.idToken));
//     }
//     storeAccessToken();
//     storeIDToken();
// }

// export function resetTokens({ accessToken, idToken }: tokens) {
//     function resetAccessToken() {
//         localStorage.removeItem(accessStorageName);
//         accessToken.resetAccessToken();
//     }
//     function resetIdToken() {
//         localStorage.removeItem(idStorageName);
//         idToken.resetIdToken();
//     }
//     resetAccessToken();
//     resetIdToken();
// }

// export function loadAccessToken() {
//     const accessToken = AccessToken.getInstance();

//     if (accessToken.accessToken) {
//         return accessToken;
//     }

//     const newAccessToken = localStorage.getItem('accessToken');
//     if (!newAccessToken) {
//         return null;
//     }
//     accessToken.accessToken = newAccessToken;
//     return accessToken;
// }

// export function loadIDToken() {
//     const idToken = OpenIDToken.getInstance();

//     if (idToken.idToken) {
//         return idToken;
//     }

//     const newIDTokenJSON = localStorage.getItem(idStorageName);
//     if (!newIDTokenJSON) {
//         return null;
//     }
//     const newIDToken: IDToken = JSON.parse(newIDTokenJSON);
//     if (!newIDToken) {
//         throw new Response(
//             JSON.stringify({
//                 message: 'Can not parse id Token',
//             }),
//             { status: 400 }
//         );
//     }
//     idToken.idToken = newIDToken;
//     return idToken;
// }
