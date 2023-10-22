import { isSendEvent } from '../ICTPhase/EventCheckers';
import { sendSecretExchangeEventDetail } from './Events';

export function isSendSecretExchangeEvent<ID>(
    event: Event
): event is CustomEvent<sendSecretExchangeEventDetail<ID>> {
    return (
        isSendEvent(event) && 'jwt' in event.detail && 'type' in event.detail
    );
}
