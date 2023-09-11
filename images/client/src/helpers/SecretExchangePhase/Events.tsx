import { sendJWTEventDetail } from '../ICTPhase/Events';

export const sendPubKeyDHEventID = 'sendPubKeyDH';
export interface sendPubKeyDHEventDetail<ID> extends sendJWTEventDetail<ID> {}
