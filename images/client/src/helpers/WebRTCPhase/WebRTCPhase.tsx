import { generateSDPMessage, verifySDPMessage } from './SDPMessageJWT';

class verifiedCallPartner {
    // Saved verified Public Key of Call Partner
    ICTPubKey: CryptoKey;
    // Saved identity of Call Partner
    identity: { name: string; email: string };

    constructor(
        ICTPubKey: CryptoKey,
        identity: { name: string; email: string }
    ) {
        this.ICTPubKey = ICTPubKey;
        this.identity = identity;
    }
}

export class WebRTCPhase<ID> extends EventTarget {
    isCaller: boolean;
    target: ID;
    rtcConnection: RTCPeerConnection;
    callPartner: verifiedCallPartner;
    selfKeyPair: CryptoKeyPair;

    constructor(
        selfKeyPair: CryptoKeyPair,
        ICTPubKey: CryptoKey,
        identity: { name: string; email: string },
        target: ID,
        isCaller: boolean
    ) {
        super();
        this.callPartner = new verifiedCallPartner(ICTPubKey, identity);
        this.selfKeyPair = selfKeyPair;
        this.target = target;

        this.isCaller = isCaller;
        this.rtcConnection = new RTCPeerConnection();

        this.rtcConnection.onnegotiationneeded = async () => {
            // changed media w/o pending remoteDesription --> self is now caller
            this.isCaller = true;

            const offer = await this.rtcConnection.createOffer();
            this.rtcConnection.setLocalDescription(offer);
        };
        this.rtcConnection.onicecandidate = (ev) => {
            let candidate = ev.candidate;
            // Empty candidate shows no more candidates
            if (!candidate) {
                //? Issue Event for Display
                if (isCaller) {
                    this.createRTCOffer();
                    // Display Ready State
                    const newOfferReadyEvent = new CustomEvent('offerReady', {
                        detail: {
                            time: Date.now,
                        },
                    });

                    this.dispatchEvent(newOfferReadyEvent);
                } else {
                    this.createRTCAnswer();

                    const newAnswerReadyEvent = new CustomEvent('answerReady', {
                        detail: {
                            time: Date.now,
                        },
                    });

                    this.dispatchEvent(newAnswerReadyEvent);
                }
            }
        };

        if (isCaller) {
            const newGetUserMediaEvent = new CustomEvent('getUserMedia', {
                detail: {
                    time: Date.now,
                },
            });
            this.dispatchEvent(newGetUserMediaEvent);
        }
    }

    async createRTCOffer() {
        const offer = this.rtcConnection.localDescription;

        if (!offer) {
            throw Error('Called empty localDescription');
        }

        const offerMsg = await generateSDPMessage(offer, this.selfKeyPair);

        const newSendOfferMsgEvent = new CustomEvent('sendOfferMsg', {
            detail: {
                offerMsg,
                target: this.target,
                time: Date.now,
            },
        });
        this.dispatchEvent(newSendOfferMsgEvent);
    }

    async receiveRTCOffer(origin: ID, offerMsg: string) {
        // Ignore incoming offers from unknown origins
        if (origin !== this.target) {
            return;
        }

        const offer = await verifySDPMessage(
            offerMsg,
            this.callPartner.ICTPubKey
        );

        // Received new offer --> self is now the callee
        this.isCaller = false;

        this.rtcConnection.setRemoteDescription(offer);

        const newGetUserMediaEvent = new CustomEvent('getUserMedia', {
            detail: {
                time: Date.now,
            },
        });
        this.dispatchEvent(newGetUserMediaEvent);
    }

    async createAnswer() {
        const answer = await this.rtcConnection.createAnswer();
        this.rtcConnection.setRemoteDescription(answer);
    }

    async createRTCAnswer() {
        const answer = this.rtcConnection.remoteDescription;

        if (!answer) {
            throw Error('Called empty localDescription');
        }

        const answerMsg = await generateSDPMessage(answer, this.selfKeyPair);

        const newSendOfferMsgEvent = new CustomEvent('sendAnswerMsg', {
            detail: {
                offerMsg: answerMsg,
                target: this.target,
                time: Date.now,
            },
        });
        this.dispatchEvent(newSendOfferMsgEvent);
    }

    async receiveRTCAnswer(origin: ID, answerMsg: string) {
        // Ignore incoming answers from unknown origins
        if (origin !== this.target) {
            return;
        }

        const answer = await verifySDPMessage(
            answerMsg,
            this.callPartner.ICTPubKey
        );

        this.rtcConnection.setRemoteDescription(answer);

        const newRTCAnswerReceivedEvent = new CustomEvent('rtcAnswerReceived', {
            detail: {
                time: Date.now,
            },
        });
        this.dispatchEvent(newRTCAnswerReceivedEvent);
    }
}
