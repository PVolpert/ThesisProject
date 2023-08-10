import { StateCreator } from 'zustand';
import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { SettingsSlice } from './SettingsSlice';
import { SdpMessage } from '../../helpers/Signaling/Messages';
import { UserId, UserInfo } from '../../helpers/Signaling/User';
import { ModalSlice } from './ModalSlice';
import { OutgoingCallSlice } from './OutgoingCallSlice';

interface State {
    isRTCConnectionActive: boolean;
    offerMsg: SdpMessage | undefined;
    callee: UserInfo | undefined;
}

interface Actions {
    setRTCConnectionState: (newIsRTCConnectionActive: boolean) => void;
    setSdpOffer: (newSdpOffer: SdpMessage) => void;
    setCallee: (newCallee: UserInfo) => void;
    resetRTCConnectionSlice: () => void;
}

export interface RTCConnectionSlice extends State, Actions {}

const initialState: State = {
    isRTCConnectionActive: false,
    offerMsg: undefined,
    callee: undefined,
};

export const createRTCConnectionSlice: StateCreator<
    RTCConnectionSlice &
        SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        OutgoingCallSlice,
    [],
    [],
    RTCConnectionSlice
> = (set) => ({
    ...initialState,
    setRTCConnectionState: (newIsRTCConnectionActive) =>
        set({ isRTCConnectionActive: newIsRTCConnectionActive }),
    setSdpOffer: (newSdpOffer) => set({ offerMsg: newSdpOffer }),
    setCallee: (newCallee) => set({ callee: newCallee }),
    resetRTCConnectionSlice: () => set({ ...initialState }),
});
