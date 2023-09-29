import { StateCreator } from 'zustand';

import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { WebRTCPhaseSlice } from './WebRTCPhaseSlice';
import { ModalSlice } from './ModalSlice';
import { OutgoingCallSlice } from './OutgoingCallSlice';
import { IncomingCallSlice } from './IncomingCallSlice';
import { ICTPhaseSlice } from './ICTPhaseSlice';
import { SettingsSlice } from './SettingsSlice';
import { UserInfo } from '../../helpers/Signaling/User';

interface State {
    activeUsers: UserInfo[];
}

interface Actions {
    setActiveUsers: (newActiveUsers: UserInfo[]) => void;
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
        OutgoingCallSlice &
        IncomingCallSlice &
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
