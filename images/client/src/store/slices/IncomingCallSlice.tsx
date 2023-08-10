import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';
import { ModalSlice } from './ModalSlice';
import { AccessTokenSlice } from './AccessTokenSlice';
import { OutgoingCallSlice } from './OutgoingCallSlice';

interface State {
    incomingCallStage: 0 | 1;
}

interface Actions {}

export interface IncomingCallSlice extends State, Actions {}

const initialState: State = {
    incomingCallStage: 0,
};

export const createIncomingCallSlice: StateCreator<
    AccessTokenSlice &
        SettingsSlice &
        OutgoingCallSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        RTCConnectionSlice &
        IncomingCallSlice,
    [],
    [],
    IncomingCallSlice
> = (set) => ({
    ...initialState,
});
