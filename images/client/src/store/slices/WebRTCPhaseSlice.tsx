import { StateCreator } from 'zustand';
import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { SettingsSlice } from './SettingsSlice';
import { ModalSlice } from './ModalSlice';
import { ICTPhaseSlice } from './ICTPhaseSlice';
import { SignalingSlice } from './SignalingSlice';

interface State {}

interface Actions {}

export interface WebRTCPhaseSlice extends State, Actions {}

const initialState: State = {};

export const createWebRTCPhaseSlice: StateCreator<
    WebRTCPhaseSlice &
        SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        ICTPhaseSlice &
        SignalingSlice,
    [],
    [],
    WebRTCPhaseSlice
> = () => ({ ...initialState });
