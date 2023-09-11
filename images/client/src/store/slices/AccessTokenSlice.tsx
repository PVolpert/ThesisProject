import {
    getValidatedIdTokenClaims,
    IDToken,
    OpenIDTokenEndpointResponse,
} from 'oauth4webapi';
import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { WebRTCPhaseSlice } from './WebRTCPhaseSlice';
import { ModalSlice } from './ModalSlice';
import { OutgoingCallSlice } from './OutgoingCallSlice';
import { IncomingCallSlice } from './IncomingCallSlice';
import { ImmerStateCreator } from '../storeHelper';
import { ICTPhaseSlice } from './ICTPhaseSlice';

interface State {
    accessToken: string;
    idToken: IDToken | null;
}

interface Actions {
    parseAuth: (newTokenResponse: OpenIDTokenEndpointResponse) => void;
    resetAuthToken: () => void;
}

export interface AccessTokenSlice extends State, Actions {}

const initialState: State = {
    accessToken: '',
    idToken: null,
};

export const createAccessTokenSlice: StateCreator<
    AccessTokenSlice &
        OutgoingCallSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        WebRTCPhaseSlice &
        IncomingCallSlice &
        SettingsSlice &
        ICTPhaseSlice,
    [],
    [],
    AccessTokenSlice
> = (set) => ({
    ...initialState,
    parseAuth: (newTokenResponse) => set({ ...parseToken(newTokenResponse) }),
    resetAuthToken: () => set({ ...initialState }),
});

export function parseToken(response: OpenIDTokenEndpointResponse) {
    const { access_token: newAccessToken } = response;
    const newIdToken = getValidatedIdTokenClaims(response);
    return {
        accessToken: newAccessToken,
        idToken: newIdToken,
    };
}
