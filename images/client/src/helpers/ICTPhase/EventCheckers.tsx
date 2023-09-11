import {
    sendCallAnswerEventDetail,
    sendCallOfferEventDetail,
    sendConfirmationEventDetail,
    sendEventDetail,
    sendICTAnswerEventDetail,
    sendICTOfferEventDetail,
    sendICTPeerMessageEventDetail,
    sendICTPhaseFailedEventID,
    sendJWTEventDetail,
    sendOPsToPeersEventDetail,
    sendStartExchangeEventDetail,
    timedEventDetail,
    verifyCallAnswersEventDetail,
    verifyCalleeIDsEventDetail,
    verifyCallerIDEventDetail,
    verifyPeersIDsEventDetail,
} from './Events';

export function isCustomEvent(event: Event): event is CustomEvent {
    return 'detail' in event;
}

export function isTimedEvent(
    event: Event
): event is CustomEvent<timedEventDetail> {
    return isCustomEvent(event) && 'time' in event.detail;
}

export function isSendEvent<ID>(
    event: Event
): event is CustomEvent<sendEventDetail<ID>> {
    return isTimedEvent(event) && 'target' in event;
}
export function isSendJWTEvent<ID>(
    event: Event
): event is CustomEvent<sendJWTEventDetail<ID>> {
    return isSendEvent(event) && 'jwt' in event.detail;
}

export function isSendCallOfferEvent<ID>(
    event: Event
): event is CustomEvent<sendCallOfferEventDetail<ID>> {
    return isSendEvent(event);
}

export function isSendCallAnswerEvent<ID>(
    event: Event
): event is CustomEvent<sendCallAnswerEventDetail<ID>> {
    return isSendEvent(event) && 'OPs' in event.detail;
}

export function isSendOPsToPeersEvent<ID>(
    event: Event
): event is CustomEvent<sendOPsToPeersEventDetail<ID>> {
    return isSendEvent(event) && 'OPs' in event.detail;
}

export function isSendICTOfferEvent<ID>(
    event: Event
): event is CustomEvent<sendICTOfferEventDetail<ID>> {
    return isSendJWTEvent(event);
}

export function isSendICTAnswerEvent<ID>(
    event: Event
): event is CustomEvent<sendICTAnswerEventDetail<ID>> {
    return isSendJWTEvent(event);
}

export function isSendStartExchangeEvent<ID>(
    event: Event
): event is CustomEvent<sendStartExchangeEventDetail<ID>> {
    return isSendJWTEvent(event);
}

export function isSendICTPeerMessageEvent<ID>(
    event: Event
): event is CustomEvent<sendICTPeerMessageEventDetail<ID>> {
    return isSendJWTEvent(event);
}

export function isSendConfirmationEvent<ID>(
    event: Event
): event is CustomEvent<sendConfirmationEventDetail<ID>> {
    return (
        isSendEvent(event) && 'sign' in event.detail && 'nonce' in event.detail
    );
}

export function isSendICTPhaseFailedEvent<ID>(
    event: Event
): event is CustomEvent<sendICTPhaseFailedEventID<ID>> {
    return isSendEvent(event);
}

export function isVerifyCallAnswersEvent<ID>(
    event: Event
): event is CustomEvent<verifyCallAnswersEventDetail<ID>> {
    return isTimedEvent(event) && 'callPartnersOPs' in event.detail;
}

export function isVerifyCallerIDEvent(
    event: Event
): event is CustomEvent<verifyCallerIDEventDetail> {
    return (
        isTimedEvent(event) &&
        'identity' in event.detail &&
        'partnerOPs' in event.detail
    );
}

export function isVerifyCalleeIDsEvent<ID>(
    event: Event
): event is CustomEvent<verifyCalleeIDsEventDetail<ID>> {
    return (
        isTimedEvent(event) &&
        'callees' in event.detail &&
        'keyPairs' in event.detail
    );
}

export function isVerifyPeersIDsEvent<ID>(
    event: Event
): event is CustomEvent<verifyPeersIDsEventDetail<ID>> {
    return isTimedEvent(event) && 'callees' in event.detail;
}
