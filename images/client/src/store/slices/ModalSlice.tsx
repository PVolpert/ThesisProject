import { StateCreator } from 'zustand';
import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { SettingsSlice } from './SettingsSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';
import { CallStageSlice } from './CallStageSlice';
import { SignalingSlice } from './SignalingSlice';

interface State {
    isSettingsModalShown: boolean;
    isSignalModalShown: boolean;
    isIncomingCallModalShown: boolean;
    isOutgoingCallModalShown: boolean;
}

interface Actions {
    showSettingsModal: () => void;
    hideSettingsModal: () => void;
    showSignalModal: () => void;
    hideSignalModal: () => void;
    showIncomingCallModal: () => void;
    hideIncomingCallModal: () => void;
    showOutgoingCallModal: () => void;
    hideOutgoingCallModal: () => void;
}

export interface ModalSlice extends State, Actions {}

const initialState: State = {
    isSettingsModalShown: false,
    isSignalModalShown: false,
    isIncomingCallModalShown: false,
    isOutgoingCallModalShown: false,
};

export const createModalSlice: StateCreator<
ModalSlice &
AccessTokenSlice &
ICTAccessTokenSlice &
RTCConnectionSlice &
CallStageSlice &
SettingsSlice &
        SignalingSlice,
    [],
    [],
    ModalSlice
> = (set) => ({
    ...initialState,
    showSettingsModal: () =>
        set({ ...initialState, isSettingsModalShown: true }),
    hideSettingsModal: () => set({ isSettingsModalShown: false }),
    showSignalModal: () => set({ ...initialState, isSignalModalShown: true }),
    hideSignalModal: () => set({ isSignalModalShown: false }),
    showIncomingCallModal: () =>
        set({ ...initialState, isIncomingCallModalShown: true }),
    hideIncomingCallModal: () => set({ isIncomingCallModalShown: false }),
    showOutgoingCallModal: () =>
        set({ ...initialState, isOutgoingCallModalShown: true }),
    hideOutgoingCallModal: () => set({ isOutgoingCallModalShown: false }),
});