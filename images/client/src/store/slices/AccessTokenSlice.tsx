import {
    getValidatedIdTokenClaims,
    IDToken,
    OpenIDTokenEndpointResponse,
} from 'oauth4webapi';
import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';
import { ModalSlice } from './ModalSlice';
import { CallStageSlice } from './CallStageSlice';
import { SignalingSlice } from './SignalingSlice';

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
        CallStageSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        RTCConnectionSlice &
        SignalingSlice,
    SettingsSlice & [],
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