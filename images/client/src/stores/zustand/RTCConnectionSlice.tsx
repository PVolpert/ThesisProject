import { StateCreator } from 'zustand';
import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { CallOptionsSlice } from './CallOptionsSlice';
import { SdpMessage } from '../../wrappers/Signaling/Messages';
import { UserId } from '../../wrappers/Signaling/User';

interface State {
    isRTCConnectionActive: boolean;
    offerMsg: SdpMessage | undefined;
    target: UserId | undefined;
}

interface Actions {
    setRTCConnectionState: (newIsRTCConnectionActive: boolean) => void;
    setSdpOffer: (newSdpOffer: SdpMessage) => void;
    setTarget: (newTarget: UserId) => void;
    resetRTCConnectionSlice: () => void;
}

export interface RTCConnectionSlice extends State, Actions {}

const initialState: State = {
    isRTCConnectionActive: false,
    offerMsg: undefined,
    target: undefined,
};

export const createRTCConnectionSlice: StateCreator<
    CallOptionsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        RTCConnectionSlice,
    [],
    [],
    RTCConnectionSlice
> = (set) => ({
    ...initialState,
    setRTCConnectionState: (newIsRTCConnectionActive) =>
        set({ isRTCConnectionActive: newIsRTCConnectionActive }),
    setSdpOffer: (newSdpOffer) => set({ offerMsg: newSdpOffer }),
    setTarget: (newTarget) => set({ target: newTarget }),
    resetRTCConnectionSlice: () => set({ ...initialState }),
});
