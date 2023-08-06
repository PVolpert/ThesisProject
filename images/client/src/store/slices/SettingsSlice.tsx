import { StateCreator } from 'zustand';

import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';
import { CallSettings } from '../../components/Settings/CallSettings';
import { ModalSlice } from './ModalSlice';
import { CallStageSlice } from './CallStageSlice';
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
        RTCConnectionSlice &
        ModalSlice &
        CallStageSlice &
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
