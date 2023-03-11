import { SignalingMessage } from '../model/Signaling';

export class BroadcastWrapper {
    channel;

    constructor(channelName: string) {
        this.channel = new BroadcastChannel(channelName);
    }

    send(msg: SignalingMessage) {
        this.channel.postMessage(JSON.stringify(msg));
    }

    addEventListener(
        eventType: 'message',
        listener: (event: MessageEvent<string>) => void
    ) {
        this.channel.addEventListener(eventType, listener);
    }
}
