import { sendEventDetail, timedEventDetail } from '../ICTPhase/Events';

export const sendSecretExchangeEventID = 'sendSecretExchangeEvent';
export const startSFUEventID = 'startSFUEvent';
export interface sendSecretExchangeEventDetail<ID> extends sendEventDetail<ID> {
    type: sendSecretExchangeMessageType;
    jwt: string;
}

export type sendSecretExchangeMessageType =
    | 'sendGroupLeaderPubKeyDH'
    | 'sendMemberPubKeyDH'
    | 'sendSharedSecret';

export interface startSFUEventDetail extends timedEventDetail {}
