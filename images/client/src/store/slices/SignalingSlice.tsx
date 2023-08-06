import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';
import { ModalSlice } from './ModalSlice';
import { AccessTokenSlice } from './AccessTokenSlice';
import { CallStageSlice } from './CallStageSlice';

interface State {
    userList: string[];
}

interface Actions {}

export interface SignalingSlice extends State, Actions {}

const initialState: State = {
    userList: [],
};

export const createSignalingSlice: StateCreator<
    AccessTokenSlice &
        SettingsSlice &
        CallStageSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        RTCConnectionSlice &
        SignalingSlice,
    [],
    [],
    SignalingSlice
> = (set) => ({
    ...initialState,
});
