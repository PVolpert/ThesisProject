import { StateCreator } from 'zustand';

import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { WebRTCPhaseSlice } from './WebRTCPhaseSlice';
import { CallSettings } from '../../components/Settings/CallSettings';
import { ModalSlice } from './ModalSlice';
import { ICTPhaseSlice } from './ICTPhaseSlice';
import { SignalingSlice } from './SignalingSlice';

interface State {
    callSettings: CallSettings;
}

interface Actions {
    updateCallSettings: (newCallSettings: CallSettings) => void;
}

export interface SettingsSlice extends State, Actions {}

const initialState: State = {
    callSettings: {
        video: true,
        audio: false,
    },
};

export const createSettingsSlice: StateCreator<
    SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        WebRTCPhaseSlice &
        ModalSlice &
        ICTPhaseSlice &
        SignalingSlice,
    [],
    [],
    SettingsSlice
> = (set) => ({
    ...initialState,
    updateCallSettings: (newCallSettings) =>
        set({
            callSettings: { ...newCallSettings },
        }),
});
