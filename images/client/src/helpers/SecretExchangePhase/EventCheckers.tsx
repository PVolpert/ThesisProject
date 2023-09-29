import { isSendEvent } from '../ICTPhase/EventCheckers';
import {
    sendGroupLeaderPubKeyDHEventDetail,
    sendJWTEventDetail,
    sendMemberPubKeyDHEventDetail,
    sendSharedSecretEventDetail,
} from './Events';

function isSendJWTEvent<ID>(
    event: Event
): event is CustomEvent<sendJWTEventDetail<ID>> {
    return isSendEvent(event) && 'jwt' in event.detail;
}

export function isSendGroupLeaderPubKeyDHEvent<ID>(
    event: Event
): event is CustomEvent<sendGroupLeaderPubKeyDHEventDetail<ID>> {
    return isSendJWTEvent(event);
}

export function isSendMemberPubKeyDHEvent<ID>(
    event: Event
): event is CustomEvent<sendMemberPubKeyDHEventDetail<ID>> {
    return isSendJWTEvent(event);
}

export function isSendSharedSecretEvent<ID>(
    event: Event
): event is CustomEvent<sendSharedSecretEventDetail<ID>> {
    return isSendJWTEvent(event);
}
