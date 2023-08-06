import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';
import { ModalSlice } from './ModalSlice';
import { AccessTokenSlice } from './AccessTokenSlice';
import { SignalingSlice } from './SignalingSlice';

type outgoingCallStage = 0 | 1 | 2;


interface State {
    outgoingCallStage: outgoingCallStage;
    incomingCallStage: 0 | 1;
}

interface Actions {
    resetCallStages: () => void;
    setOutgoingCallStage: (newStage: outgoingCallStage) => void
}

export interface CallStageSlice extends State, Actions {}

const initialState: State = {
    outgoingCallStage: 0,
    incomingCallStage: 0,
};

export const createCallStageSlice: StateCreator<
    CallStageSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        RTCConnectionSlice &
        SettingsSlice &
        SignalingSlice,
    [],
    [],
    CallStageSlice
> = (set) => ({
    ...initialState,
    resetCallStages: () => set({ ...initialState }),
    setOutgoingCallStage: (newStage) => set({outgoingCallStage: newStage}) 
});
