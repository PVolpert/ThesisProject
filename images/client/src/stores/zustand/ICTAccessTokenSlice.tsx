// Store a Group of Tokens issued by ICT Providers

// ICT Auth Tokens are only used to gain ICT Tokens

// Store must be able to
// Remove an individual token
// Add or update an indiviual Token

// Map seems to be the most reasonable choice
import { IDToken, OpenIDTokenEndpointResponse } from 'oauth4webapi';
import { StateCreator } from 'zustand';
import { CallOptionsSlice } from './CallOptionsSlice';
import { AccessTokenSlice, parseToken } from './AccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';

interface TokenSet {
    accessToken: string;
    idToken: IDToken;
}

interface State {
    ictTokens: TokenSet[];
}

interface Actions {
    parseICT: (tokenResponse: OpenIDTokenEndpointResponse) => void;
    resetIctToken: (issuer: string) => void;
    resetIctTokens: () => void;
}

export interface ICTAccessTokenSlice extends State, Actions {}

const initialState: State = {
    ictTokens: [],
};

export const createICTAccessTokenSlice: StateCreator<
    CallOptionsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        RTCConnectionSlice,
    [],
    [],
    ICTAccessTokenSlice
> = (set) => ({
    ...initialState,
    parseICT: (tokenResponse) =>
        set((state) => {
            const newTokenSet = parseToken(tokenResponse);
            if (
                state.ictTokens.some((ictToken) => {
                    return ictToken.idToken.iss == newTokenSet.idToken.iss;
                })
            ) {
                return state;
            }
            return {
                ictTokens: state.ictTokens.concat([newTokenSet]),
            };
        }),
    resetIctToken: (issuer) =>
        set((state) => ({
            ictTokens: state.ictTokens.filter((ictToken) => {
                return issuer != ictToken.idToken.iss;
            }),
        })),
    resetIctTokens: () => set(() => ({ ...initialState })),
});
