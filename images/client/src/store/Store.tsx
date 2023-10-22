import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    createAccessTokenSlice,
    AccessTokenSlice,
} from './slices/AccessTokenSlice';
import { SettingsSlice, createSettingsSlice } from './slices/SettingsSlice';
import {
    ICTAccessTokenSlice,
    createICTAccessTokenSlice,
} from './slices/ICTAccessTokenSlice';
import {
    WebRTCPhaseSlice,
    createWebRTCPhaseSlice,
} from './slices/WebRTCPhaseSlice';
import { ModalSlice, createModalSlice } from './slices/ModalSlice';

import { ICTPhaseSlice, createICTPhaseSlice } from './slices/ICTPhaseSlice';
import { SignalingSlice, createSignalingSlice } from './slices/SignalingSlice';

export const useStore = create<
    SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        WebRTCPhaseSlice &
        ModalSlice &
        ICTPhaseSlice &
        SignalingSlice
>()(
    persist(
        (...a) => ({
            ...createAccessTokenSlice(...a),
            ...createSettingsSlice(...a),
            ...createICTAccessTokenSlice(...a),
            ...createWebRTCPhaseSlice(...a),
            ...createModalSlice(...a),
            ...createICTPhaseSlice(...a),
            ...createSignalingSlice(...a),
        }),
        {
            name: 'token-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                idToken: state.idToken,
                ictTokens: state.ictTokenSets,
            }),
        }
    )
);
