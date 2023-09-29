import {
    sendCandidatesEventDetail,
    sendEventDetail,
    sendICTMessageEventDetail,
    sendNotifyMessageEventDetail,
    sendOPNMessageEventDetail,
    timedEventDetail,
    verifyEventDetail,
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
export function isSendICTMessageEvent<ID>(
    event: Event
): event is CustomEvent<sendICTMessageEventDetail<ID>> {
    return (
        isSendEvent(event) && 'jwt' in event.detail && 'type' in event.detail
    );
}
export function isSendNotifyMessageEvent<ID>(
    event: Event
): event is CustomEvent<sendNotifyMessageEventDetail<ID>> {
    return isSendEvent(event) && 'type' in event.detail;
}
export function isSendOPNMessageEvent<ID>(
    event: Event
): event is CustomEvent<sendOPNMessageEventDetail<ID>> {
    return (
        isSendEvent(event) && 'OPNMap' in event.detail && 'type' in event.detail
    );
}
export function isSendCandidatesMessageEvent<ID>(
    event: Event
): event is CustomEvent<sendCandidatesEventDetail<ID>> {
    return isSendEvent(event) && 'candidateIDs' in event.detail;
}

export function isVerifyEvent<ID>(
    event: Event
): event is CustomEvent<verifyEventDetail<ID>> {
    return (
        isTimedEvent(event) &&
        'candidates' in event.detail &&
        'type' in event.detail
    );
}
