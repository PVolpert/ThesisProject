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
import {
    OutgoingCallSlice,
    createOutgoingCallSlice,
} from './slices/OutgoingCallSlice';
import {
    IncomingCallSlice,
    createIncomingCallSlice,
} from './slices/IncomingCallSlice';

export const useStore = create<
    SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        RTCConnectionSlice &
        ModalSlice &
        OutgoingCallSlice &
        IncomingCallSlice
>()(
    persist(
        (...a) => ({
            ...createAccessTokenSlice(...a),
            ...createSettingsSlice(...a),
            ...createICTAccessTokenSlice(...a),
            ...createRTCConnectionSlice(...a),
            ...createModalSlice(...a),
            ...createOutgoingCallSlice(...a),
            ...createIncomingCallSlice(...a),
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
