// Store a Group of Tokens issued by ICT Providers

// ICT Auth Tokens are only used to gain ICT Tokens

// Store must be able to
// Remove an individual token
// Add or update an indiviual Token

// Map seems to be the most reasonable choice
import { OpenIDTokenEndpointResponse } from 'oauth4webapi';
import { StateCreator } from 'zustand';
import { CallOptionsSlice } from './CallOptionsSlice';
import { AccessTokenSlice } from './AccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';

interface State {
    ictTokenMap: Map<String, String>;
}

interface Actions {
    parseICT: (
        tokenResponse: OpenIDTokenEndpointResponse,
        issuer: string
    ) => void;
    resetICT: (issuer: string) => void;
    resetICTs: () => void;
}

export interface ICTAccessTokenSlice extends State, Actions {}

const initialState: State = {
    ictTokenMap: new Map<String, String>(),
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
    parseICT: (tokenResponse, issuer) =>
        set((state) => ({
            ictTokenMap: new Map<String, String>(state.ictTokenMap).set(
                issuer,
                extractAccessToken(tokenResponse)
            ),
        })),
    resetICT: (issuer) =>
        set((state) => ({
            ictTokenMap: new Map(state.ictTokenMap).set(issuer, ''),
        })),
    resetICTs: () => set(() => ({ ...initialState })),
});

function extractAccessToken(response: OpenIDTokenEndpointResponse) {
    const { access_token: newAccessToken } = response;
    return newAccessToken;
}
