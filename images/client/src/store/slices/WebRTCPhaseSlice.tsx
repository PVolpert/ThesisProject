import { StateCreator } from 'zustand';
import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { SettingsSlice } from './SettingsSlice';
import { UserId } from '../../helpers/Signaling/User';
import { ModalSlice } from './ModalSlice';
import { OutgoingCallSlice } from './OutgoingCallSlice';
import { ReadyState } from 'react-use-websocket';
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
        OutgoingCallSlice &
        ICTPhaseSlice &
        SignalingSlice,
    [],
    [],
    WebRTCPhaseSlice
> = (set) => ({});
