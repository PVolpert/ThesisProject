import { isSendEvent } from '../ICTPhase/EventCheckers';
import { sendProductIdEventDetail } from './Events';

export function isSendProductIdEvent<ID>(
    event: Event
): event is CustomEvent<sendProductIdEventDetail<ID>> {
    return isSendEvent(event) && 'producerId' in event.detail;
}
