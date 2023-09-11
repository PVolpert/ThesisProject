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
import {
    OutgoingCallSlice,
    createOutgoingCallSlice,
} from './slices/OutgoingCallSlice';
import {
    IncomingCallSlice,
    createIncomingCallSlice,
} from './slices/IncomingCallSlice';
import { ICTPhaseSlice, createICTPhaseSlice } from './slices/ICTPhaseSlice';

export const useStore = create<
    SettingsSlice &
        AccessTokenSlice &
        ICTAccessTokenSlice &
        WebRTCPhaseSlice &
        ModalSlice &
        OutgoingCallSlice &
        IncomingCallSlice &
        ICTPhaseSlice
>()(
    persist(
        (...a) => ({
            ...createAccessTokenSlice(...a),
            ...createSettingsSlice(...a),
            ...createICTAccessTokenSlice(...a),
            ...createWebRTCPhaseSlice(...a),
            ...createModalSlice(...a),
            ...createOutgoingCallSlice(...a),
            ...createIncomingCallSlice(...a),
            ...createICTPhaseSlice(...a),
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
