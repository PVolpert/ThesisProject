import {
    getValidatedIdTokenClaims,
    IDToken,
    OpenIDTokenEndpointResponse,
} from 'oauth4webapi';
import { StateCreator } from 'zustand';
import { CallOptionsSlice } from './CallOptionsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';

interface State {
    accessToken: string;
    idToken: IDToken | null;
}

interface Actions {
    parseAuth: (tokenResponse: OpenIDTokenEndpointResponse) => void;
    resetAuth: () => void;
}

export interface AccessTokenSlice extends State, Actions {}

const initialState: State = {
    accessToken: '',
    idToken: null,
};

export const createAccessTokenSlice: StateCreator<
    CallOptionsSlice & AccessTokenSlice & ICTAccessTokenSlice,
    [],
    [],
    AccessTokenSlice
> = (set) => ({
    ...initialState,
    parseAuth: (tokenResponse) => set({ ...parseToken(tokenResponse) }),
    resetAuth: () => set(initialState),
});

function parseToken(response: OpenIDTokenEndpointResponse) {
    const { access_token: newAccessToken } = response;
    const newIdToken = getValidatedIdTokenClaims(response);
    return {
        accessToken: newAccessToken,
        idToken: newIdToken,
    };
}
