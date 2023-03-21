import {
    getValidatedIdTokenClaims,
    IDToken,
    OpenIDTokenEndpointResponse,
} from 'oauth4webapi';
import { StateCreator } from 'zustand';
import { CallOptionsSlice } from './CallOptionsSlice';

interface State {
    accessToken: string;
    idToken: IDToken | null;
}

interface Actions {
    parse: (tokenResponse: OpenIDTokenEndpointResponse) => void;
    reset: () => void;
}

export interface TokenSlice extends State, Actions {}

const initialState: State = {
    accessToken: '',
    idToken: null,
};

export const createTokenSlice: StateCreator<
    CallOptionsSlice & TokenSlice,
    [],
    [],
    TokenSlice
> = (set) => ({
    ...initialState,
    parse: (tokenResponse) => set({ ...parseTokens(tokenResponse) }),
    reset: () => set(initialState),
});

function parseTokens(response: OpenIDTokenEndpointResponse) {
    const { access_token: accessToken } = response;
    const idToken = getValidatedIdTokenClaims(response);
    return {
        accessToken,
        idToken,
    };
}
