// Store a Group of Tokens issued by ICT Providers

// ICT Auth Tokens are only used to gain ICT Tokens

// Store must be able to
// Remove an individual token
// Add or update an indiviual Token

// Map seems to be the most reasonable choice
import { IDToken } from 'oauth4webapi';
import { StateCreator } from 'zustand';
import { SettingsSlice } from './SettingsSlice';
import { AccessTokenSlice } from './AccessTokenSlice';
import { ModalSlice } from './ModalSlice';
import { OutgoingCallSlice } from './OutgoingCallSlice';
import { IncomingCallSlice } from './IncomingCallSlice';
import { WebRTCPhaseSlice } from './WebRTCPhaseSlice';
import { ICTPhaseSlice } from './ICTPhaseSlice';
import { SignalingSlice } from './SignalingSlice';

export interface TokenSet {
    accessToken: string;
    idToken: IDToken;
}

interface State {
    ictTokenSets: TokenSet[];
}

interface Actions {
    parseICT: (tokenSet: TokenSet) => void;
    resetIctToken: (issuer: string) => void;
    resetIctTokens: () => void;
}

export interface ICTAccessTokenSlice extends State, Actions {}

const initialState: State = {
    ictTokenSets: [],
};

export const createICTAccessTokenSlice: StateCreator<
    ICTAccessTokenSlice &
        AccessTokenSlice &
        OutgoingCallSlice &
        ModalSlice &
        WebRTCPhaseSlice &
        SettingsSlice &
        IncomingCallSlice &
        ICTPhaseSlice &
        SignalingSlice,
    [],
    [],
    ICTAccessTokenSlice
> = (set) => ({
    ...initialState,
    parseICT: (tokenSet) =>
        set((state) => {
            if (
                state.ictTokenSets.some((ictToken) => {
                    return ictToken.idToken.iss == tokenSet.idToken.iss;
                })
            ) {
                return state;
            }
            return {
                ictTokenSets: state.ictTokenSets.concat([tokenSet]),
            };
        }),
    resetIctToken: (issuer) =>
        set((state) => ({
            ictTokenSets: state.ictTokenSets.filter((ictToken) => {
                return issuer != ictToken.idToken.issuer;
            }),
        })),
    resetIctTokens: () => set(() => ({ ...initialState })),
});
