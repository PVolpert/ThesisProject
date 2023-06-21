import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAccessTokenSlice, AccessTokenSlice } from './AccessTokenSlice';
import { CallOptionsSlice, createCallOptionsSlice } from './CallOptionsSlice';
import {
    ICTAccessTokenSlice,
    createICTAccessTokenSlice,
} from './ICTAccessTokenSlice';
import {
    RTCConnectionSlice,
    createRTCConnectionSlice,
} from './RTCConnectionSlice';

export const useZustandStore = create<
    CallOptionsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        RTCConnectionSlice
>()(
    persist(
        (...a) => ({
            ...createAccessTokenSlice(...a),
            ...createCallOptionsSlice(...a),
            ...createICTAccessTokenSlice(...a),
            ...createRTCConnectionSlice(...a),
        }),
        {
            name: 'token-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                idToken: state.idToken,
                ictTokens: state.ictTokens,
            }),
        }
    )
);
