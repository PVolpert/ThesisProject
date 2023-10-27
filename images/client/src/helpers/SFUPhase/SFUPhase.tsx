import { Device } from 'mediasoup-client';
import {
    MediaKind,
    RtpCapabilities,
    RtpParameters,
} from 'mediasoup-client/lib/RtpParameters';
import {
    AppData,
    DtlsParameters,
    IceCandidate,
    IceParameters,
    Transport,
} from 'mediasoup-client/lib/types';
import { Identity } from '../ICTPhase/ICTPhase';
import { MutexMap } from '../Mutex/MutexMap';
import { SecretExchangePhaseGroupMember } from '../SecretExchangePhase/SecretExchangePhase';
import { CallSettings } from '../../components/Settings/CallSettings';
import {
    newMediaStreamEventDetail,
    newMediaStreamEventID,
    sendProductIdEventDetail,
    sendProductIdEventId,
} from './Events';

export class SFUPhaseGroupMember {
    identity: Identity;
    remoteStream?: MediaStream;
    encryptedRemoteStream?: MediaStream;
    constructor(identity: Identity) {
        this.identity = identity;
    }
}

class SFUPhaseSelf {
    callSettings?: CallSettings;

    Transports: {
        audio?: Transport<AppData>;
        video?: Transport<AppData>;
    };
    localStream?: MediaStream;
    encryptedLocalStream?: MediaStream;

    constructor() {
        this.Transports = {};
    }
}

interface RouterCapabilitiesResponseBody {
    routerCapabilities: RtpCapabilities;
}

function isRouterCapabilitiesResponseBody(
    body: any
): body is RouterCapabilitiesResponseBody {
    return 'routerCapabilities' in body;
}

interface CreateTransportResponseBody {
    id: string;
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    dtlsParameters: DtlsParameters;
}

function isCreateTransportResponseBody(
    body: any
): body is CreateTransportResponseBody {
    return (
        'id' in body &&
        'iceParameters' in body &&
        'iceCandidates' in body &&
        'dtlsParameters' in body
    );
}
interface ProduceResponseBody {
    id: string;
}

function isProduceResponseBody(body: any): body is ProduceResponseBody {
    return 'id' in body;
}
interface ConsumeResponseBody {
    rtpParameters: RtpParameters;
    id: string;
    kind: MediaKind;
}

function isConsumeResponseBody(body: any): body is ConsumeResponseBody {
    return 'rtpParameters' in body && 'id' in body && 'kind' in body;
}

function convertSecretExchangeMemberMaptoMemberMutexMap<ID>(
    candidateMap: Map<ID, SecretExchangePhaseGroupMember>
) {
    return new MutexMap(
        new Map(
            [...candidateMap].map(([memberID, secretExchangeGroupMember]) => [
                memberID,
                new SFUPhaseGroupMember(secretExchangeGroupMember.identity),
            ])
        )
    );
}

class SFUPhaseValues<ID> extends EventTarget {
    protected device: Device;
    protected self: SFUPhaseSelf;
    protected groupMemberMap?: MutexMap<ID, SFUPhaseGroupMember>;
    protected sharedSecret?: CryptoKey;
    protected postRequestBuilder?: ({
        url,
        postBody,
        callback,
        errback,
    }: {
        url: string;
        postBody: any;
        callback: (resp: any) => Promise<any>;
        errback: (e: unknown) => Promise<void>;
    }) => Promise<any>;

    protected getRequestBuilder?: ({
        url,
        callback,
        errback,
    }: {
        url: string;
        callback: (resp: any) => Promise<any>;
        errback: (e: unknown) => Promise<void>;
    }) => Promise<any>;

    constructor() {
        super();
        this.device = new Device();
        this.self = new SFUPhaseSelf();
    }

    async getSFUPhaseValues() {
        return {
            localStream: this.self.localStream,
            encryptedLocalStream: this.self.encryptedLocalStream,
            members: await this.groupMemberMap?.exportToMap(),
        };
    }
}

class SFUPhaseHTTP<ID> extends SFUPhaseValues<ID> {
    protected async sendCreateTransport() {
        if (!this.getRequestBuilder) throw new Error('missing requestBuilder');
        return this.getRequestBuilder({
            url: 'http://sfu.localhost/createTransport',
            async callback(response) {
                const jsonResponseBody = await response.json();
                if (!isCreateTransportResponseBody(jsonResponseBody))
                    throw Error('');

                return {
                    id: jsonResponseBody.id,
                    dtlsParameters: jsonResponseBody.dtlsParameters,
                    iceCandidates: jsonResponseBody.iceCandidates,
                    iceParameters: jsonResponseBody.iceParameters,
                };
            },
            async errback(e) {
                throw e;
            },
        });
    }
    protected async sendRouterCapabilities() {
        if (!this.getRequestBuilder) throw new Error('missing requestBuilder');
        return this.getRequestBuilder({
            url: 'http://sfu.localhost/routerCapabilities',
            async callback(response) {
                const jsonResponseBody = await response.json();
                if (!isRouterCapabilitiesResponseBody(jsonResponseBody))
                    throw Error('');
                return jsonResponseBody.routerCapabilities;
            },
            async errback(e) {
                throw e;
            },
        });
    }

    protected async sendConnect(
        dtlsParameters: DtlsParameters,
        transportId: string
    ): Promise<void> {
        if (!this.postRequestBuilder) throw new Error('missing requestBuilder');
        return this.postRequestBuilder({
            url: 'http://sfu.localhost/connect',
            postBody: { dtlsParameters, transportId },
            async callback() {},
            async errback(e) {
                throw e;
            },
        });
    }

    protected async sendProduce(
        transportId: string,
        produceParameters: {
            kind: MediaKind;
            rtpParameters: RtpParameters;
        }
    ) {
        if (!this.postRequestBuilder) throw new Error('missing requestBuilder');
        return this.postRequestBuilder({
            url: 'http://sfu.localhost/produce',
            postBody: { ...produceParameters, transportId },
            async callback(response) {
                const jsonResponseBody = await response.json();
                if (!isProduceResponseBody(jsonResponseBody)) throw new Error();
                return jsonResponseBody.id;
            },
            async errback(e) {
                throw e;
            },
        });
    }
    protected async sendConsume(
        transportId: string,
        producerId: string,
        rtpCapabilities: RtpCapabilities
    ) {
        if (!this.postRequestBuilder) throw new Error('missing requestBuilder');
        return this.postRequestBuilder({
            url: 'http://sfu.localhost/consume',
            postBody: { transportId, producerId, rtpCapabilities },
            async callback(response) {
                const jsonResponseBody = await response.json();
                if (!isConsumeResponseBody(jsonResponseBody)) throw new Error();
                return {
                    rtpParameters: jsonResponseBody.rtpParameters,
                    id: jsonResponseBody.id,
                    kind: jsonResponseBody.kind,
                };
            },
            async errback(e) {
                throw e;
            },
        });
    }
}

class SFUPhaseSend<ID> extends SFUPhaseHTTP<ID> {
    async setupSFUPhase(
        members: Map<ID, SecretExchangePhaseGroupMember>,
        sharedSecret: CryptoKey,
        callSettings: CallSettings,
        postRequestBuilder: ({
            url,
            postBody,
            callback,
            errback,
        }: {
            url: string;
            postBody: any;
            callback: (resp: any) => Promise<any>;
            errback: (e: unknown) => Promise<void>;
        }) => Promise<any>,
        getRequestBuilder: ({
            url,
            callback,
            errback,
        }: {
            url: string;
            callback: (resp: any) => Promise<any>;
            errback: (e: unknown) => Promise<void>;
        }) => Promise<any>
    ) {
        this.self.callSettings = callSettings;
        this.sharedSecret = sharedSecret;
        this.postRequestBuilder = postRequestBuilder;
        this.getRequestBuilder = getRequestBuilder;
        this.groupMemberMap =
            convertSecretExchangeMemberMaptoMemberMutexMap(members);

        console.log('Finished Setup of SFU Phase. Start SFU Interaction');
        this.setRTPCapabilities();
    }

    protected async setRTPCapabilities() {
        console.log('Requesting Capabilities');
        const routerRtpCapabilities = (await this.sendRouterCapabilities()) as
            | RtpCapabilities
            | undefined;
        if (!routerRtpCapabilities) throw new Error('');
        await this.device.load({ routerRtpCapabilities });

        if (this.self.callSettings?.video && !this.device.canProduce('video')) {
            throw new Error('Router can not handle video');
        }
        if (this.self.callSettings?.audio && !this.device.canProduce('audio')) {
            throw new Error('Router can not handle audio');
        }
        this.createSelfTransports();
    }

    protected async createSendTransport() {
        const transportOptions = await this.sendCreateTransport();
        if (!transportOptions) throw new Error('');
        const transport = this.device.createSendTransport(transportOptions);

        transport.on(
            'connect',
            async (
                connectParameters: {
                    dtlsParameters: DtlsParameters;
                },
                callback: () => void,
                errBack: (error: Error) => void
            ) => {
                try {
                    await this.sendConnect(
                        connectParameters.dtlsParameters,
                        transport.id
                    );
                    callback();
                } catch (error) {
                    errBack(error as Error);
                }
            }
        );

        transport.on(
            'produce',
            async (
                produceParameters: {
                    kind: MediaKind;
                    rtpParameters: RtpParameters;
                },
                callback: ({ id }: { id: string }) => void,
                errBack: (error: Error) => void
            ) => {
                try {
                    const id = await this.sendProduce(
                        transport.id,
                        produceParameters
                    );
                    if (!id) throw new Error('Unable to produce');

                    console.log(`Linked Stream Track to Producer ${id}`);

                    this.groupMemberMap?.forEach((_, target) => {
                        const newSendProductIdEvent = new CustomEvent<
                            sendProductIdEventDetail<ID>
                        >(sendProductIdEventId, {
                            detail: {
                                time: Date.now(),
                                producerId: id,
                                target: target,
                            },
                        });
                        this.dispatchEvent(newSendProductIdEvent);
                    });

                    callback({ id });
                } catch (error) {
                    errBack(error as Error);
                }
            }
        );
        return transport;
    }

    protected async createSelfTransports() {
        console.log('Requesting Transports');
        if (this.self.callSettings?.video) {
            this.self.Transports.video = await this.createSendTransport();
        }
        if (this.self.callSettings?.audio) {
            this.self.Transports.audio = await this.createSendTransport();
        }

        await this.acquireMediaStream();
    }

    protected async produceTransportContent() {
        console.log('Linking Stream to SFU');
        // Invoke Produce for own Transports
        if (!this.self.localStream) {
            return;
        }
        if (this.self.callSettings?.video) {
            const track = this.self.localStream.getVideoTracks()[0];
            this.self.Transports.video?.produce({ track });
        }
        if (this.self.callSettings?.audio) {
            const track = this.self.localStream.getAudioTracks()[0];
            this.self.Transports.audio?.produce({ track });
        }
    }

    protected async acquireMediaStream() {
        //! In the future we also do Insertable Streams here

        if (!this.self.callSettings?.audio && !this.self.callSettings?.video) {
            console.log('No Media to send. Skipping Producer Step');
            return;
        }

        console.log('Acquiring LocalStream');
        const constraints: MediaStreamConstraints = {
            video:
                this.self.callSettings?.video === true
                    ? { width: { ideal: 1920 }, height: { ideal: 1080 } }
                    : false,
            audio: this.self.callSettings?.audio === true,
        };

        this.self.localStream = await navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
                return stream;
            })
            .catch((error) => {
                console.error('Error accessing local media:', error);
                return undefined;
            });

        const newMediaStreamEvent = new CustomEvent<newMediaStreamEventDetail>(
            newMediaStreamEventID,
            { detail: { time: Date.now() } }
        );
        this.dispatchEvent(newMediaStreamEvent);
        this.produceTransportContent();
    }
}

export class SFUPhaseReceive<ID> extends SFUPhaseSend<ID> {
    protected async createReceiveTransport() {
        const transportOptions = await this.sendCreateTransport();
        if (!transportOptions) throw new Error('');
        const transport = this.device.createRecvTransport(transportOptions);
        transport.on(
            'connect',
            async (
                connectParameters: {
                    dtlsParameters: DtlsParameters;
                },
                callback: () => void,
                errBack: (error: Error) => void
            ) => {
                try {
                    await this.sendConnect(
                        connectParameters.dtlsParameters,
                        transport.id
                    );
                    callback();
                } catch (error) {
                    errBack(error as Error);
                }
            }
        );
        return transport;
    }

    async setNewConsumer(origin: ID, producerId: string) {
        const member = await this.groupMemberMap?.get(origin);

        if (!member) {
            throw new Error('unknown member');
        }

        const transport = await this.createReceiveTransport();

        const { rtpParameters, id, kind } = (await this.sendConsume(
            transport.id,
            producerId,
            this.device.rtpCapabilities
        )) as {
            rtpParameters: RtpParameters | undefined;
            id: string;
            kind: MediaKind;
        };
        if (!rtpParameters) {
            throw new Error('Could not acquire rtpParameters for consumption');
        }

        const { track } = await transport.consume({
            id,
            producerId: producerId,
            rtpParameters,
            kind,
        });

        const remoteStream = member.remoteStream;

        if (!remoteStream) {
            const newRemoteStream = new MediaStream();
            newRemoteStream.addTrack(track);
            await this.groupMemberMap?.set(origin, {
                ...member,
                remoteStream: newRemoteStream,
            });
        } else {
            remoteStream.addTrack(track);
            await this.groupMemberMap?.set(origin, { ...member, remoteStream });
        }
        const newMediaStreamEvent = new CustomEvent<newMediaStreamEventDetail>(
            newMediaStreamEventID,
            { detail: { time: Date.now() } }
        );
        this.dispatchEvent(newMediaStreamEvent);
    }
}
