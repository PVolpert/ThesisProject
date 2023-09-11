import { ICTPhaseCandidate, OPsMap } from './ICTPhase';

export interface timedEventDetail {
    time: number;
}

// Events to Signaling Service
export interface sendEventDetail<ID> extends timedEventDetail {
    target: ID;
}

export interface sendJWTEventDetail<ID> extends sendEventDetail<ID> {
    jwt: string;
}
export const sendCallOfferEventId = 'sendCallOffer';
export interface sendCallOfferEventDetail<ID> extends sendEventDetail<ID> {}

export const sendCallAnswerEventId = 'sendCallAnswer';
export interface sendCallAnswerEventDetail<ID> extends sendEventDetail<ID> {
    OPs: OPsMap;
}

export const sendOPsToPeersEventId = 'sendOPsToPeers';
export interface sendOPsToPeersEventDetail<ID> extends sendEventDetail<ID> {
    OPs: OPsMap;
}

export const sendICTOfferEventId = 'sendICTOffer';
export interface sendICTOfferEventDetail<ID> extends sendJWTEventDetail<ID> {}

export const sendICTAnswerEventId = 'sendICTAnswer';
export interface sendICTAnswerEventDetail<ID> extends sendJWTEventDetail<ID> {}

export const sendStartExchangeEventId = 'sendStartExchange';
export interface sendStartExchangeEventDetail<ID>
    extends sendJWTEventDetail<ID> {}

export const sendICTPeerMessageEventId = 'sendICTPeerMessage';
export interface sendICTPeerMessageEventDetail<ID>
    extends sendJWTEventDetail<ID> {}

export const sendConfirmationEventId = 'sendConfirmation';
export interface sendConfirmationEventDetail<ID> extends sendEventDetail<ID> {
    sign: string;
    nonce: string;
}

export const sendICTPhaseFailedEventID = 'sendICTPhaseFailed';
export interface sendICTPhaseFailedEventID<ID> extends sendEventDetail<ID> {}

// Events to UI

export const verifyCallAnswersEventId = 'selectPeersOPs';
export interface verifyCallAnswersEventDetail<ID> extends timedEventDetail {
    callCandidatesOPs: Map<ID, OPsMap>;
}

export const verifyCallerIDEventId = 'verifyCallerID';
export interface verifyCallerIDEventDetail extends timedEventDetail {
    identity: { name: string; email: string };
    partnerOPs: OPsMap;
}

export const verifyCalleeIDsEventId = 'verifyCalleeIDs';
export interface verifyCalleeIDsEventDetail<ID> extends timedEventDetail {
    callees: Map<ID, ICTPhaseCandidate>;
    keyPairs: Map<ID, CryptoKeyPair>;
}

export const verifyPeersIDsEventId = 'verifyPeersIDs';
export interface verifyPeersIDsEventDetail<ID> extends timedEventDetail {
    callees: Map<ID, ICTPhaseCandidate>;
}

export const newSendICTPhaseFailedEvent = new CustomEvent(
    'sendICTPhaseFailed',
    {
        detail: {
            time: Date.now(),
        },
    }
);

// Switch ICT Phase

export const startSecretEventID = 'startSecret';
export interface startSecretEventDetail<ID> extends timedEventDetail {
    callees: Map<ID, ICTPhaseCandidate>;
    keyPairs: Map<ID, CryptoKeyPair>;
}
