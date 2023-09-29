import { sendEventDetail } from '../ICTPhase/Events';

export interface sendJWTEventDetail<ID> extends sendEventDetail<ID> {
    jwt: string;
}

export const sendGroupLeaderPubKeyDHEventID = 'sendGroupLeaderPubKeyDH';
export interface sendGroupLeaderPubKeyDHEventDetail<ID>
    extends sendJWTEventDetail<ID> {}
export const sendMemberPubKeyDHEventID = 'sendMemberPubKeyDH';
export interface sendMemberPubKeyDHEventDetail<ID>
    extends sendJWTEventDetail<ID> {}
export const sendSharedSecretEventID = 'sendSharedSecret';
export interface sendSharedSecretEventDetail<ID>
    extends sendJWTEventDetail<ID> {}
