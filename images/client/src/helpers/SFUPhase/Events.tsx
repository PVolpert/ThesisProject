import { sendEventDetail, timedEventDetail } from '../ICTPhase/Events';

export const newMediaStreamEventID = 'newMediaStream';

export const sendProductIdEventId = 'sendProductId';

export interface sendProductIdEventDetail<ID> extends sendEventDetail<ID> {
    producerId: string;
}
export interface newMediaStreamEventDetail extends timedEventDetail {}
