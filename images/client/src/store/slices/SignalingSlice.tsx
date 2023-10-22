import { StateCreator } from 'zustand';

import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { WebRTCPhaseSlice } from './WebRTCPhaseSlice';
import { ModalSlice } from './ModalSlice';
import { ICTPhaseSlice } from './ICTPhaseSlice';
import { SettingsSlice } from './SettingsSlice';
import { UserId } from '../../helpers/Signaling/User';

interface State {
    activeUsers: UserId[];
}

interface Actions {
    setActiveUsers: (newActiveUsers: UserId[]) => void;
}

export interface SignalingSlice extends State, Actions {}

const initialState: State = {
    activeUsers: [],
};

export const createSignalingSlice: StateCreator<
    SignalingSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        WebRTCPhaseSlice &
        ModalSlice &
        ICTPhaseSlice &
        SettingsSlice,
    [],
    [],
    SignalingSlice
> = (set) => ({
    ...initialState,
    setActiveUsers(newActiveUsers) {
        set({ activeUsers: newActiveUsers });
    },
});
