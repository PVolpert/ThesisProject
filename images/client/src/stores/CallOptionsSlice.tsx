import { StateCreator } from 'zustand';

import { CallOptions } from '../components/Call/CallOptions/CallOptions';
import { TokenSlice } from './TokeSlice';

interface State {
    callOptions: CallOptions;
}

interface Actions {
    update: (newCallOptions: CallOptions) => void;
}

export interface CallOptionsSlice extends State, Actions {}

const initialState: State = {
    callOptions: {
        video: true,
        audio: true,
    },
};

export const createCallOptionsSlice: StateCreator<
    CallOptionsSlice & TokenSlice,
    [],
    [],
    CallOptionsSlice
> = (set) => ({
    ...initialState,
    // TODO Review update process of slices
    update: (newCallOptions) =>
        set((state) => ({
            callOptions: newCallOptions,
        })),
});
