import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';
import { ModalSlice } from './ModalSlice';
import { AccessTokenSlice } from './AccessTokenSlice';
import { IncomingCallSlice } from './IncomingCallSlice';

type OutgoingCallModalStage = 0 | 1 | 2;

export type LoadState = 'loading' | 'done' | 'failed';

interface State {
    outgoingCallModalStage: OutgoingCallModalStage;

    ictLoadState: LoadState;
    offerLoadState: LoadState;
    sendOfferLoadState: LoadState;
}

interface Actions {
    resetOutgoingCallSlice: () => void;
    setOutgoingCallModalStage: (newStage: OutgoingCallModalStage) => void;
    setOutgoingCallProcessICT: (newLoadState: LoadState) => void;
    setOutgoingCallProcessOffer: (newLoadState: LoadState) => void;
    setOutgoingCallProcessSendOffer: (newLoadState: LoadState) => void;
}

export interface OutgoingCallSlice extends State, Actions {}

const initialState: State = {
    outgoingCallModalStage: 0,
    ictLoadState: 'loading',
    offerLoadState: 'loading',
    sendOfferLoadState: 'loading',
};

export const createOutgoingCallSlice: StateCreator<
    OutgoingCallSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        RTCConnectionSlice &
        SettingsSlice &
        IncomingCallSlice,
    [],
    [],
    OutgoingCallSlice
> = (set) => ({
    ...initialState,
    resetOutgoingCallSlice: () => set({ ...initialState }),
    setOutgoingCallModalStage: (newStage) =>
        set({ outgoingCallModalStage: newStage }),
    setOutgoingCallProcessICT: (newLoadState) =>
        set({ ictLoadState: newLoadState }),
    setOutgoingCallProcessOffer: (newLoadState) =>
        set({ offerLoadState: newLoadState }),
    setOutgoingCallProcessSendOffer: (newLoadState) =>
        set({ sendOfferLoadState: newLoadState }),
});
