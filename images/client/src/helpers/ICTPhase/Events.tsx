import { Candidate } from './ICTPhase';

export const EventID = {
    sendICTMessage: 'sendICTMessage',
    sendOPNMessage: 'sendOPNMessage',
    notify: 'notifyMessage',
    sendCandidates: 'sendStartExchange',

    verify: 'verify',
    startSecret: 'startSecret',
};
export interface timedEventDetail {
    time: number;
}

// Events to Signaling Service
export type ICTMessageType = 'ICT-Offer' | 'ICT-Answer' | 'ICT-Transfer';

export type OPNMessageType = 'Call-Answer' | 'Peer-OPN';

export type NotifyMessageType =
    | 'Conference-Offer'
    | 'Call-Offer'
    | 'Confirmation';
export interface sendEventDetail<ID> extends timedEventDetail {
    target: ID;
}

export interface sendICTMessageEventDetail<ID> extends sendEventDetail<ID> {
    type: ICTMessageType;
    OPNMap?: Map<string, string>;
    jwt: string;
}

export interface sendNotifyMessageEventDetail<ID> extends sendEventDetail<ID> {
    type: NotifyMessageType;
}

export interface sendOPNMessageEventDetail<ID> extends sendEventDetail<ID> {
    OPNMap: Map<string, string>;
    type: OPNMessageType;
}

export interface sendCandidatesEventDetail<ID> extends sendEventDetail<ID> {
    candidateIDs: ID[];
}

// Events to UI
export type VerifyEventType =
    | 'Caller'
    | 'Callees'
    | 'Peers'
    | 'OPN'
    | 'Peer-OPN';

export interface verifyEventDetail<ID> extends timedEventDetail {
    candidates: Map<ID, Candidate>;
    type: VerifyEventType;
}

// Switch ICT Phase

export interface startSecretEventDetail extends timedEventDetail {}
