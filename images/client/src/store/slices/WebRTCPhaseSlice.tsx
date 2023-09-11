import { StateCreator } from 'zustand';
import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { SettingsSlice } from './SettingsSlice';
import { UserId } from '../../helpers/Signaling/User';
import { ModalSlice } from './ModalSlice';
import { OutgoingCallSlice } from './OutgoingCallSlice';
import { ReadyState } from 'react-use-websocket';
import { ICTPhaseSlice } from './ICTPhaseSlice';

interface State {
    shouldBlockOutsideOffers: boolean;
    incomingOffer: RTCSessionDescription | undefined;
    incomingAnswer: RTCSessionDescription | undefined;
    callPartner: UserId | undefined;
    signalingConnectionState: ReadyState;
}

interface Actions {
    setShouldBlockOutsideOffers: (enable: boolean) => void;
    setIncomingOffer: (newOffer: RTCSessionDescription) => void;
    setIncomingAnswer: (newAnswer: RTCSessionDescription) => void;
    setCallPartner: (newCallPartner: UserId) => void;
    resetRTCConnectionSlice: () => void;
    setSignalingConnectionState: (newState: ReadyState) => void;
}

export interface WebRTCPhaseSlice extends State, Actions {}

const initialState: State = {
    shouldBlockOutsideOffers: false,
    incomingOffer: undefined,
    incomingAnswer: undefined,
    callPartner: undefined,
    signalingConnectionState: ReadyState.CLOSED,
};

export const createWebRTCPhaseSlice: StateCreator<
    WebRTCPhaseSlice &
        SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        OutgoingCallSlice &
        ICTPhaseSlice,
    [],
    [],
    WebRTCPhaseSlice
> = (set) => ({
    ...initialState,
    setShouldBlockOutsideOffers: (updateRTCConnectionState) =>
        set({ shouldBlockOutsideOffers: updateRTCConnectionState }),
    setIncomingOffer: (newOffer) => set({ incomingOffer: newOffer }),
    setIncomingAnswer: (newAnswer) => set({ incomingAnswer: newAnswer }),
    setCallPartner: (newCallPartner) => set({ callPartner: newCallPartner }),
    setSignalingConnectionState: (newState) =>
        set({ signalingConnectionState: newState }),
    resetRTCConnectionSlice: () => set({ ...initialState }),
});
