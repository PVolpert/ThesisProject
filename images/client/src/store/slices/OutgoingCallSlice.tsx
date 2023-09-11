import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { WebRTCPhaseSlice } from './WebRTCPhaseSlice';
import { ModalSlice } from './ModalSlice';
import { AccessTokenSlice } from './AccessTokenSlice';
import { IncomingCallSlice } from './IncomingCallSlice';
import { ICTPhaseSlice } from './ICTPhaseSlice';

type OutgoingCallModalStage = 0 | 1 | 2;

export type AsyncTaskState = 'pending' | 'fulfilled' | 'rejected';

interface State {
    calleeUserName: string;
    outgoingCallModalStage: OutgoingCallModalStage;
    ictOfferLoadState: AsyncTaskState;
    offerLoadState: AsyncTaskState;
    sendOfferLoadState: AsyncTaskState;
    answerReceivedState: AsyncTaskState;
    acceptAnswer: AsyncTaskState;
}

interface Actions {
    resetOutgoingCallSlice: () => void;
    setOutgoingCallModalStage: (newStage: OutgoingCallModalStage) => void;
    setICTOfferLoadState: (newLoadState: AsyncTaskState) => void;
    setOfferLoadState: (newLoadState: AsyncTaskState) => void;
    setOfferSendLoadState: (newLoadState: AsyncTaskState) => void;
    setAnswerReceivedLoadState: (newLoadState: AsyncTaskState) => void;
    setCalleeUserName: (newUserName: string) => void;
    setAcceptAnswer: (newAccept: AsyncTaskState) => void;
}

export interface OutgoingCallSlice extends State, Actions {}

const initialState: State = {
    outgoingCallModalStage: 0,
    ictOfferLoadState: 'pending',
    offerLoadState: 'pending',
    sendOfferLoadState: 'pending',
    answerReceivedState: 'pending',
    calleeUserName: '',
    acceptAnswer: 'pending',
};

export const createOutgoingCallSlice: StateCreator<
    OutgoingCallSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        WebRTCPhaseSlice &
        SettingsSlice &
        IncomingCallSlice &
        ICTPhaseSlice,
    [],
    [],
    OutgoingCallSlice
> = (set) => ({
    ...initialState,
    resetOutgoingCallSlice: () => set({ ...initialState }),
    setOutgoingCallModalStage: (newStage) =>
        set({ outgoingCallModalStage: newStage }),
    setICTOfferLoadState: (newLoadState) =>
        set({ ictOfferLoadState: newLoadState }),
    setOfferLoadState: (newLoadState) => set({ offerLoadState: newLoadState }),
    setOfferSendLoadState: (newLoadState) =>
        set({ sendOfferLoadState: newLoadState }),
    setCalleeUserName: (newUserName) => set({ calleeUserName: newUserName }),
    setAnswerReceivedLoadState: (newLoadState) =>
        set({ answerReceivedState: newLoadState }),
    setAcceptAnswer: (newLoadState) => {
        set({ acceptAnswer: newLoadState });
    },
});
