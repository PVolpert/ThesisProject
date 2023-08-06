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
    RTCConnectionSlice,
    createRTCConnectionSlice,
} from './slices/RTCConnectionSlice';
import { ModalSlice, createModalSlice } from './slices/ModalSlice';
import { CallStageSlice, createCallStageSlice } from './slices/CallStageSlice';
import { SignalingSlice, createSignalingSlice } from './slices/SignalingSlice';

export const useStore = create<
    SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        RTCConnectionSlice &
        ModalSlice &
        CallStageSlice &
        SignalingSlice
>()(
    persist(
        (...a) => ({
            ...createAccessTokenSlice(...a),
            ...createSettingsSlice(...a),
            ...createICTAccessTokenSlice(...a),
            ...createRTCConnectionSlice(...a),
            ...createModalSlice(...a),
            ...createCallStageSlice(...a),
            ...createSignalingSlice(...a),
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
