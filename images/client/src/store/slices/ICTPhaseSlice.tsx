import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { ModalSlice } from './ModalSlice';
import { OutgoingCallSlice } from './OutgoingCallSlice';
import { SettingsSlice } from './SettingsSlice';
import { UserId } from '../../helpers/Signaling/User';
import { ImmerStateCreator } from '../storeHelper';

interface State {
    nonceMap: Map<string, UserId>;
}

interface Actions {
    addNonce: (nonce: string, user: UserId) => void;
    removeNonce: (nonce: string) => void;
}

export interface ICTPhaseSlice extends State, Actions {}

const initialState: State = {
    nonceMap: new Map(),
};

export const createICTPhaseSlice: StateCreator<
    ICTPhaseSlice &
        SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        ModalSlice &
        OutgoingCallSlice &
        ICTPhaseSlice,
    [],
    [],
    ICTPhaseSlice
> = (set) => ({
    ...initialState,
    addNonce: (key, value) => {
        set((state) => {
            const newMap = new Map(state.nonceMap);
            newMap.set(key, value);
            return { nonceMap: newMap };
        });
    },
    removeNonce: (key) => {
        set((state) => {
            const newMap = new Map(state.nonceMap);
            newMap.delete(key);
            return { nonceMap: newMap };
        });
    },
});
