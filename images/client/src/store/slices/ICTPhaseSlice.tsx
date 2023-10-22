import { StateCreator } from 'zustand';

import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { ModalSlice } from './ModalSlice';
import { SettingsSlice } from './SettingsSlice';
import { UserId } from '../../helpers/Signaling/User';
import { ReadyState } from 'react-use-websocket';
import { SignalingSlice } from './SignalingSlice';
import {
    ICTProviderInfo,
    convertToICTProvider,
} from '../../helpers/ICTPhase/OpenIDProvider';
import OIDCProvider from '../../helpers/Auth/OIDCProvider';

interface State {
    signalingConnectionState: ReadyState;
    candidates: UserId[];
    type?: 'call' | 'conference';
    caller?: UserId;
    trustedOpenIDProviders: ICTProviderInfo[];
}

interface Actions {
    setSignalingConnectionState: (newState: ReadyState) => void;
    setCandidates: (newCandidates: UserId[]) => void;
    setCaller: (newCaller: UserId) => void;
    setType: (newType: 'call' | 'conference') => void;
    setTrustedOpenIDProviders: (newOIDCProviders: OIDCProvider[]) => void;
    resetICTPhaseSlice: () => void;
}

export interface ICTPhaseSlice extends State, Actions {}

const initialState: State = {
    signalingConnectionState: ReadyState.CLOSED,
    candidates: [],
    caller: undefined,
    type: undefined,
    trustedOpenIDProviders: [],
};

export const createICTPhaseSlice: StateCreator<
    ICTPhaseSlice &
        SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        ICTPhaseSlice &
        SignalingSlice,
    [],
    [],
    ICTPhaseSlice
> = (set) => ({
    ...initialState,
    setSignalingConnectionState: (newState) =>
        set({ signalingConnectionState: newState }),
    setCandidates(newCandidates) {
        set({ candidates: newCandidates });
    },
    setCaller(newCaller) {
        set({ caller: newCaller });
    },
    setType(newType) {
        set({ type: newType });
    },
    setTrustedOpenIDProviders(newOIDCProviders) {
        set({
            trustedOpenIDProviders: newOIDCProviders.map(convertToICTProvider),
        });
    },
    resetICTPhaseSlice() {
        set({ ...initialState });
    },
});
