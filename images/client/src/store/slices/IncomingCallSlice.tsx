import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';
import { ModalSlice } from './ModalSlice';
import { AccessTokenSlice } from './AccessTokenSlice';
import { AsyncTaskState, OutgoingCallSlice } from './OutgoingCallSlice';

interface State {
    incomingCallStage: 0 | 1;
    answerLoadState: AsyncTaskState;
    ictAnswerLoadState: AsyncTaskState;
    answerSentLoadState: AsyncTaskState;
}

interface Actions {
    setAnswerLoadState: (newLoadState: AsyncTaskState) => void;
    setICTAnswerLoadState: (newLoadState: AsyncTaskState) => void;
    setAnswerSentLoadState: (newLoadState: AsyncTaskState) => void;
    setIncomingCallModalStage: (newStage: 0 | 1) => void;
}

export interface IncomingCallSlice extends State, Actions {}

const initialState: State = {
    incomingCallStage: 0,
    answerLoadState: 'pending',
    ictAnswerLoadState: 'pending',
    answerSentLoadState: 'pending',
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
    setAnswerLoadState: (newLoadState) =>
        set({ answerLoadState: newLoadState }),
    setICTAnswerLoadState: (newLoadState) =>
        set({ ictAnswerLoadState: newLoadState }),
    setAnswerSentLoadState: (newLoadState) =>
        set({ answerSentLoadState: newLoadState }),
    setIncomingCallModalStage: (newStage) =>
        set({ incomingCallStage: newStage }),
});
