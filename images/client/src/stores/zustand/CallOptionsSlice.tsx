import { StateCreator } from 'zustand';

import { CallOptions } from '../../components/Call/CallOptions/CallOptions';
import { AccessTokenSlice } from './AccessTokenSlice';
import { ICTAccessTokenSlice } from './ICTAccessTokenSlice';
import { RTCConnectionSlice } from './RTCConnectionSlice';

interface State {
    callOptions: CallOptions;
}

interface Actions {
    updateCallOptions: (newCallOptions: CallOptions) => void;
}

export interface CallOptionsSlice extends State, Actions {}

const initialState: State = {
    callOptions: {
        video: true,
    },
};

export const createCallOptionsSlice: StateCreator<
    CallOptionsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        RTCConnectionSlice,
    [],
    [],
    CallOptionsSlice
> = (set) => ({
    ...initialState,
    updateCallOptions: (newCallOptions) =>
        set({
            callOptions: { ...newCallOptions },
        }),
});
