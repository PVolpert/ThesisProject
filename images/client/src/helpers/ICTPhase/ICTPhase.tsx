import {
    newSendICTPhaseFailedEvent,
    sendCallAnswerEventDetail,
    sendCallAnswerEventId,
    sendCallOfferEventDetail,
    sendCallOfferEventId,
    sendConfirmationEventDetail,
    sendConfirmationEventId,
    sendICTAnswerEventDetail,
    sendICTAnswerEventId,
    sendICTOfferEventDetail,
    sendICTOfferEventId,
    sendICTPeerMessageEventDetail,
    sendICTPeerMessageEventId,
    sendOPsToPeersEventId,
    sendOPsToPeersEventDetail,
    sendStartExchangeEventDetail,
    sendStartExchangeEventId,
    startSecretEventDetail,
    startSecretEventID,
    verifyCallAnswersEventDetail,
    verifyCallAnswersEventId,
    verifyCalleeIDsEventDetail,
    verifyCalleeIDsEventId,
    verifyCallerIDEventDetail,
    verifyCallerIDEventId,
    verifyPeersIDsEventDetail,
    verifyPeersIDsEventId,
} from './Events';
import equal from 'fast-deep-equal';
import {
    generateICTAnswerMessage,
    generateICTOfferJWT,
    generateTargetsJWT,
    verifyICTAnswer,
    verifyICTOffer,
    verifyTargetsJWT,
} from './ICTPhaseJWT';
import { createKeyPair, getICT } from '../ICT/ICT';
import { TokenSet } from '../../store/slices/ICTAccessTokenSlice';
import { OpenIDProviderInfo } from './OpenIDProvider';
import { signString, verifyString } from '../Crypto/SignVerifyString';

export type OPsMap = Map<string, string>;

class ICTPhaseIndividuum {
    ict?: string;
    responseNonce?: string;
    OPsMap: OPsMap;

    constructor() {
        this.OPsMap = new Map();
    }
}

class ICTPhaseSelf<ID> extends ICTPhaseIndividuum {
    // KeyPair used for signing messages
    ICTKeyPairsMap: Map<ID, CryptoKeyPair>;
    //
    candidatesOPsMap: Map<ID, OPsMap>;
    trustedOIDCProviders?: OpenIDProviderInfo[];

    constructor() {
        super();
        this.ICTKeyPairsMap = new Map();
        this.candidatesOPsMap = new Map();
    }
}

export class ICTPhaseCandidate extends ICTPhaseIndividuum {
    // Saved verified Public Key of Call Partner
    ICTPubKey?: CryptoKey;
    // Saved identity of Call Partner
    identity?: { name: string; email: string };
}

class ICTPhaseValues<ID> extends EventTarget {
    callSelf: ICTPhaseSelf<ID>;
    callCandidates: Map<ID, ICTPhaseCandidate>;

    constructor() {
        super();
        this.callSelf = new ICTPhaseSelf();
        this.callCandidates = new Map();
    }
}

class ICTPhaseCaller<ID> extends ICTPhaseValues<ID> {
    constructor() {
        super();
    }

    async startCall(targets: ID[]) {
        try {
            // Add all targets as CallPartners
            targets.forEach((target) => {
                this.callCandidates.set(target, new ICTPhaseCandidate());
            });

            // Trigger an sendCallOffer event for each individuum
            targets.forEach((target) => {
                const newCallOfferEvent = new CustomEvent<
                    sendCallOfferEventDetail<ID>
                >(sendCallOfferEventId, {
                    detail: { time: Date.now(), target },
                });
                this.dispatchEvent(newCallOfferEvent);
            });
        } catch (error) {
            console.error(`Starting Call Failed because ${error}`);
        }
    }

    async setCallAnswer(origin: ID, calleeOPs?: OPsMap) {
        try {
            const callCandidate = this.callCandidates.get(origin);
            if (!callCandidate) {
                // Ignore Call Answers from unknown origin
                console.log(`Ignore call answer from unknown origin ${origin}`);
                return;
            }
            // CalleeOPs means that Call was accepted --> Save calleeOPs in Self
            if (calleeOPs) {
                this.callSelf.candidatesOPsMap.set(origin, calleeOPs);
            }
            // No calleeOPs means that Call was refused --> Drop CallPartner
            else {
                this.callCandidates.delete(origin);
                // No more callPartners --> Call fails
                if (this.callCandidates.size === 0) {
                    console.log('All callees have denied the call');
                    return;
                }
            }

            // Test if this is the last needed Call Answer via comparing received answers with original
            if (
                mapsHaveSameKeys(
                    this.callSelf.candidatesOPsMap,
                    this.callCandidates
                )
            ) {
                // Trigger an verifyCallAnswer event
                const newVerifyCallAnswersEvent = new CustomEvent<
                    verifyCallAnswersEventDetail<ID>
                >(verifyCallAnswersEventId, {
                    detail: {
                        time: Date.now(),
                        callCandidatesOPs: this.callSelf.candidatesOPsMap,
                    },
                });
                this.dispatchEvent(newVerifyCallAnswersEvent);
            }
        } catch (error) {
            console.error(error);
            // Notify outside that ICT Phase Failed
            this.dispatchEvent(newSendICTPhaseFailedEvent);
        }
    }

    async getICTs(
        getICTParameters: {
            openIDProviderInfo: OpenIDProviderInfo;
            tokenSet: TokenSet;
            targets: ID[];
        }[]
    ) {
        const icts = Promise.all(
            getICTParameters.map(
                async ({ tokenSet, openIDProviderInfo, targets }) => {
                    // Generate the KeyPair for the ICT
                    const keyPair = await createKeyPair();
                    // Generate the ICT
                    const ict = await getICT(
                        keyPair,
                        tokenSet,
                        openIDProviderInfo
                    );

                    if (!ict) {
                        throw new Error('Unable to acquire ict');
                    }

                    return {
                        targets,
                        ict,
                        keyPair,
                        oidcProvider: openIDProviderInfo,
                    };
                }
            )
        );

        return icts;
    }

    saveICTsKeyPair(
        icts: {
            targets: ID[];
            keyPair: CryptoKeyPair;
        }[]
    ) {
        icts.forEach(({ targets, keyPair }) => {
            targets.forEach((target) => {
                this.callSelf.ICTKeyPairsMap.set(target, keyPair);
            });
        });
    }

    async getJWTPairs(
        icts: {
            targets: ID[];
            ict: string;
            keyPair: CryptoKeyPair;
            oidcProvider: OpenIDProviderInfo;
        }[]
    ) {
        return (
            await Promise.all(
                icts.map(async ({ targets, ict, keyPair, oidcProvider }) => {
                    return await Promise.all(
                        targets.map(async (target) => {
                            const targetOPs =
                                this.callSelf.candidatesOPsMap.get(target);
                            if (!targetOPs) {
                                throw new Error(
                                    `missing targetOPs for target ${target}`
                                );
                            }
                            const nonce = targetOPs.get(oidcProvider.name);
                            if (!nonce) {
                                throw new Error(
                                    `missing nonce for target ${target}`
                                );
                            }

                            const selfOPS = this.callSelf.OPsMap;

                            // Generate JWT
                            const jwtOffer = await generateICTOfferJWT(
                                keyPair,
                                nonce,
                                ict,
                                selfOPS
                            );

                            return { target, jwtOffer };
                        })
                    );
                })
            )
        ).flat();
    }

    async setCallerOpenIDProviders(
        trustedOIDCProviders: OpenIDProviderInfo[],
        getICTParameters: {
            openIDProviderInfo: OpenIDProviderInfo;
            tokenSet: TokenSet;
            targets: ID[];
        }[]
    ) {
        try {
            this.callSelf.trustedOIDCProviders = trustedOIDCProviders;
            // Generate nonces
            this.callSelf.OPsMap = generateOPs(trustedOIDCProviders);

            const icts = await this.getICTs(getICTParameters);

            this.saveICTsKeyPair(icts);

            const jwtPairs = await this.getJWTPairs(icts);

            // Trigger sendICT Event
            jwtPairs.forEach(({ target, jwtOffer }) => {
                const newSendICTOfferEvent = new CustomEvent<
                    sendICTOfferEventDetail<ID>
                >(sendICTOfferEventId, {
                    detail: {
                        time: Date.now(),
                        target,
                        jwt: jwtOffer,
                    },
                });
                this.dispatchEvent(newSendICTOfferEvent);
            });
        } catch (error) {
            throw error;
        }
    }

    async setJWTAnswer(origin: ID, JWTAnswer: string = '') {
        try {
            const callCandidate = this.callCandidates.get(origin);
            if (!callCandidate) {
                console.log(`Ignore JWTAnswer from unknown origin ${origin}`);
                return;
            }
            const trustedOIDCProviders = this.callSelf.trustedOIDCProviders;

            if (!trustedOIDCProviders) {
                throw new Error('No trusted OIDCProviders set');
            }
            if (JWTAnswer) {
                const val = await verifyICTAnswer(
                    JWTAnswer,
                    callCandidate.OPsMap,
                    trustedOIDCProviders
                );
                if (!val) {
                    throw new Error('Verification of JWT failed');
                }
                const { identity, publicKey } = val;

                // Save PubKey for Verifikation
                callCandidate.ICTPubKey = publicKey;
                // Save Identity for Display
                callCandidate.identity = identity;
            }

            // Remove Target if empty/no ICT
            else {
                this.callCandidates.delete(origin);
            }

            // Trigger Event if all Targets have send their ICT Answer
            if (haveCandidatesIDandKey(this.callCandidates)) {
                const newVerifyCalleeIdentityEvent = new CustomEvent<
                    verifyCalleeIDsEventDetail<ID>
                >(verifyCalleeIDsEventId, {
                    detail: {
                        time: Date.now(),
                        callees: this.callCandidates,
                        keyPairs: this.callSelf.ICTKeyPairsMap,
                    },
                });
                this.dispatchEvent(newVerifyCalleeIdentityEvent);
            }
        } catch (error) {
            console.error(error);
            // Notify outside that ICT Phase Failed
            this.dispatchEvent(newSendICTPhaseFailedEvent);
        }
    }
}

// TODO Top-Tier Handle all catches by sending Fail
export class ICTPhaseCallee<ID> extends ICTPhaseCaller<ID> {
    constructor() {
        super();
    }

    async receiveCall(origin: ID, trustedOIDCProviders: OpenIDProviderInfo[]) {
        try {
            this.callSelf.trustedOIDCProviders = trustedOIDCProviders;
            const OPs = generateOPs(trustedOIDCProviders);

            const newCallPartner = new ICTPhaseCandidate();
            newCallPartner.OPsMap = OPs;
            // Add all targets as CallPartners
            this.callCandidates.set(origin, newCallPartner);

            // Trigger an sendCallAnswer event
            const newCallAnswerEvent = new CustomEvent<
                sendCallAnswerEventDetail<ID>
            >(sendCallAnswerEventId, {
                detail: { time: Date.now(), target: origin, OPs },
            });
            this.dispatchEvent(newCallAnswerEvent);
        } catch (error) {
            console.error(error);
            // Notify outside that ICT Phase Failed
            this.dispatchEvent(newSendICTPhaseFailedEvent);
        }
    }

    // Callee Funktion to verify ICT Offer
    async setJWTOffer(origin: ID, JWToffer: string) {
        try {
            const callCandidate = this.callCandidates.get(origin);
            if (!callCandidate) {
                console.log(`Ignore JWTOffer from unknown source ${origin}`);
                return;
            }
            const trustedOIDCProviders = this.callSelf.trustedOIDCProviders;

            if (!trustedOIDCProviders) {
                throw new Error('No trusted OIDCProviders set');
            }

            const val = await verifyICTOffer(
                JWToffer,
                callCandidate.OPsMap,
                trustedOIDCProviders
            );
            if (!val) {
                throw new Error('Verification of JWT failed');
            }
            const { identity, partnerOPs, publicKey } = val;

            // Save PubKey for Verifikation
            callCandidate.ICTPubKey = publicKey;
            // Save Identity for Display
            callCandidate.identity = identity;
            // Save Nonces for Answer
            this.callSelf.candidatesOPsMap.set(origin, partnerOPs);

            const newVerifyCallerIDEvent =
                new CustomEvent<verifyCallerIDEventDetail>(
                    verifyCallerIDEventId,
                    {
                        detail: {
                            time: Date.now(),
                            identity,
                            partnerOPs,
                        },
                    }
                );

            this.dispatchEvent(newVerifyCallerIDEvent);
        } catch (error) {
            console.error(error);
            // Notify outside that ICT Phase Failed
            this.dispatchEvent(newSendICTPhaseFailedEvent);
        }
    }

    // Callee Post Verify Caller
    async setCalleeOpenIDProvider(
        oidcProvider: OpenIDProviderInfo,
        tokenSet: TokenSet,
        target: ID
    ) {
        try {
            const keyPair = await createKeyPair();

            const ict = await getICT(keyPair, tokenSet, oidcProvider);

            if (!ict) {
                throw new Error('ICT verifikation failed');
            }

            this.callSelf.ICTKeyPairsMap.set(target, keyPair);

            const targetOPs = this.callSelf.candidatesOPsMap.get(target);
            if (!targetOPs) {
                throw new Error(`missing targetOPs for target ${target}`);
            }
            const nonce = targetOPs.get(oidcProvider.name);
            if (!nonce) {
                throw new Error(`missing nonce for target ${target}`);
            }

            const jwtAnswer = await generateICTAnswerMessage(
                keyPair,
                ict,
                nonce
            );

            const newSendICTOfferEvent = new CustomEvent<
                sendICTAnswerEventDetail<ID>
            >(sendICTAnswerEventId, {
                detail: {
                    time: Date.now(),
                    target,
                    jwt: jwtAnswer,
                },
            });
            this.dispatchEvent(newSendICTOfferEvent);
        } catch (error) {
            console.error(error);
            // Notify outside that ICT Phase Failed
            this.dispatchEvent(newSendICTPhaseFailedEvent);
        }
    }
}

export class ICTPhaseGroup<ID> extends ICTPhaseCallee<ID> {
    isGroupLeader: boolean;
    groupLeaderID?: ID;

    constructor() {
        super();
        this.isGroupLeader = false;
    }

    startPeerExchange() {
        try {
            this.isGroupLeader = true;

            this.callCandidates.forEach(async (callCandidate, userID) => {
                const targets = [...this.callCandidates.keys()].filter(
                    (target) => {
                        target !== userID;
                    }
                );
                const responseNonce = generateNonce();

                callCandidate.responseNonce = responseNonce;

                const keyPair = this.callSelf.ICTKeyPairsMap.get(userID);

                if (!keyPair) {
                    throw new Error(
                        'started PeerExchange with target w/o keypair'
                    );
                }

                const jwtTargets = await generateTargetsJWT(
                    keyPair,
                    targets,
                    responseNonce
                );

                const newSendStartExchangeEvent = new CustomEvent<
                    sendStartExchangeEventDetail<ID>
                >(sendStartExchangeEventId, {
                    detail: {
                        target: userID,
                        jwt: jwtTargets,
                        time: Date.now(),
                    },
                });
                this.dispatchEvent(newSendStartExchangeEvent);
            });
        } catch (error) {
            console.error(error);
            // Notify outside that ICT Phase Failed
            this.dispatchEvent(newSendICTPhaseFailedEvent);
        }
    }

    async sendOPsToPeers(origin: ID, targetsJWT: string) {
        try {
            const callCandidate = this.callCandidates.get(origin);
            if (!callCandidate) {
                console.log(`Ignore Target list from unknown source ${origin}`);
                return;
            }
            // Sender of Targets is the group leader
            this.groupLeaderID = origin;

            const PubKey = callCandidate.ICTPubKey;
            if (!PubKey) {
                throw new Error('Group leader has no registered pub key');
            }

            const { responseNonce, targets } = await verifyTargetsJWT<ID>(
                PubKey,
                targetsJWT
            );

            this.callSelf.responseNonce = responseNonce;

            targets.forEach((target) => {
                const newCallPartner = new ICTPhaseCandidate();
                const trustedOIDCProviders = this.callSelf.trustedOIDCProviders;
                if (!trustedOIDCProviders) {
                    throw new Error('trustedOIDCPeers is undefined');
                }
                const OPs = generateOPs(trustedOIDCProviders);

                newCallPartner.OPsMap = OPs;
                this.callCandidates.set(target, newCallPartner);
            });

            targets.forEach((target) => {
                const callCandidate = this.callCandidates.get(target);
                if (!callCandidate) {
                    throw new Error('Target has no callCandidateEntry');
                }
                const newSendOPsToPeersEvent = new CustomEvent<
                    sendOPsToPeersEventDetail<ID>
                >(sendOPsToPeersEventId, {
                    detail: {
                        time: Date.now(),
                        target,
                        OPs: callCandidate.OPsMap,
                    },
                });

                this.dispatchEvent(newSendOPsToPeersEvent);
            });
        } catch (error) {
            console.error(error);
            this.setDismiss();
        }
    }

    setPeerOPs(origin: ID, peerOPs: OPsMap) {
        try {
            const callCandidate = this.callCandidates.get(origin);
            if (!callCandidate) {
                // Ignore Call Answers from unknown origin
                console.log(
                    `Ignoring peer answer from unknown origin ${origin}`
                );
                return;
            }

            // Set the OPsMap from origin
            this.callSelf.candidatesOPsMap.set(origin, peerOPs);

            // Test if this is the last needed Call Answer via comparing received answers with original
            if (
                mapsHaveSameKeys(
                    this.callSelf.candidatesOPsMap,
                    this.callCandidates
                )
            ) {
                // Trigger an verifyCallAnswer event
                const newVerifyCallAnswersEvent = new CustomEvent<
                    verifyCallAnswersEventDetail<ID>
                >(verifyCallAnswersEventId, {
                    detail: {
                        time: Date.now(),
                        callCandidatesOPs: this.callSelf.candidatesOPsMap,
                    },
                });
                this.dispatchEvent(newVerifyCallAnswersEvent);
            }
        } catch (error) {
            console.error(error);
            this.setDismiss();
        }
    }

    async setPeersOpenIDProvider(
        getICTParameters: {
            openIDProviderInfo: OpenIDProviderInfo;
            tokenSet: TokenSet;
            targets: ID[];
        }[]
    ) {
        try {
            const icts = await this.getICTs(getICTParameters);

            this.saveICTsKeyPair(icts);

            const jwtPairs = await this.getJWTPairs(icts);

            // Trigger sendICT Event
            jwtPairs.forEach(({ target, jwtOffer: jwtPeer }) => {
                const newSendICTPeerMessageEvent = new CustomEvent<
                    sendICTPeerMessageEventDetail<ID>
                >(sendICTPeerMessageEventId, {
                    detail: {
                        time: Date.now(),
                        target,
                        jwt: jwtPeer,
                    },
                });
                this.dispatchEvent(newSendICTPeerMessageEvent);
            });
        } catch (error) {
            console.log(error);
            this.setDismiss();
        }
    }
    async setPeerAnswer(origin: ID, JWTAnswer: string) {
        try {
            const callCandidate = this.callCandidates.get(origin);
            if (!callCandidate) {
                console.log(`Ignore PeerAnswer from unknown origin ${origin}`);
                return;
            }

            const trustedOIDCProviders = this.callSelf.trustedOIDCProviders;

            if (!trustedOIDCProviders) {
                throw new Error('No trusted OIDCProviders set');
            }

            const val = await verifyICTAnswer(
                JWTAnswer,
                callCandidate.OPsMap,
                trustedOIDCProviders
            );
            if (!val) {
                throw new Error('Verification of JWT failed');
            }
            const { identity, publicKey } = val;

            // Save PubKey for Verifikation
            callCandidate.ICTPubKey = publicKey;
            // Save Identity for Display
            callCandidate.identity = identity;

            // Trigger Event if all Targets have send their ICT Answer
            if (haveCandidatesIDandKey(this.callCandidates)) {
                const newVerifyPeersIDsEvent = new CustomEvent<
                    verifyPeersIDsEventDetail<ID>
                >(verifyPeersIDsEventId, {
                    detail: {
                        time: Date.now(),
                        callees: this.callCandidates,
                    },
                });
                this.dispatchEvent(newVerifyPeersIDsEvent);
            }
        } catch (error) {
            console.error(error);
            this.setDismiss();
        }
    }

    // TODO Generate Confirmation + Send Event
    async getConfirmation() {
        try {
            const responseNonce = this.callSelf.responseNonce;
            if (!responseNonce) {
                throw new Error('Confirmation without response Nonce');
            }

            const groupLeaderID = this.groupLeaderID;

            if (!groupLeaderID) {
                throw new Error('Confirmation without groupLeader');
            }

            const keyPair = this.callSelf.ICTKeyPairsMap.get(groupLeaderID);

            if (!keyPair) {
                throw new Error('GroupLeader has no registered KeyPair');
            }

            const sign = await signString(responseNonce, keyPair.privateKey);

            const newSendConfirmationEvent = new CustomEvent<
                sendConfirmationEventDetail<ID>
            >(sendConfirmationEventId, {
                detail: {
                    time: Date.now(),
                    target: groupLeaderID,
                    sign,
                    nonce: responseNonce,
                },
            });
            this.dispatchEvent(newSendConfirmationEvent);
        } catch (error) {
            console.error(error);
            this.setDismiss();
        }
    }

    setConfirmation(origin: ID, nonce: string, sign: string) {
        try {
            const callCandidate = this.callCandidates.get(origin);

            if (!callCandidate) {
                console.log(
                    `Ignore Confirmation from unknown origin ${origin}`
                );
                return;
            }

            const responseNonce = callCandidate.responseNonce;
            if (!responseNonce) {
                throw new Error('Confirmation without response Nonce');
            }

            const pubKey = callCandidate.ICTPubKey;

            if (!pubKey) {
                throw new Error('Confirmation without pubkey');
            }

            if (!verifyString(sign, nonce, pubKey)) {
                throw new Error('Verification failed');
            }

            callCandidate.responseNonce = undefined;

            if (haveCandidatesNoOpenNonce(this.callCandidates)) {
                const newStartSecretPhase = new CustomEvent<
                    startSecretEventDetail<ID>
                >(startSecretEventID, {
                    detail: {
                        time: Date.now(),
                        callees: this.callCandidates,
                        keyPairs: this.callSelf.ICTKeyPairsMap,
                    },
                });
                this.dispatchEvent(newStartSecretPhase);
            }
        } catch (error) {
            // Trigger Event if
        }
    }

    setDismiss() {}

    // TODO Verify Confirmation + Notify Event
}

function generateOPs(oidcProviders: OpenIDProviderInfo[]) {
    const OPs: OPsMap = new Map();
    oidcProviders.forEach((oidcProvider) => {
        const nonce = generateNonce();
        OPs.set(oidcProvider.name, nonce);
    });
    return OPs;
}

function generateNonce(length: number = 16) {
    const randomBytes = new Uint8Array(length);

    crypto.getRandomValues(randomBytes);

    // Convert the random bytes to a string of decimal digits (0-9)
    let randomDigits = '';
    for (let i = 0; i < length; i++) {
        const randomValue = randomBytes[i] % 10; // Decimal digits 0-9
        randomDigits += randomValue.toString();
    }

    return randomDigits;
}

function haveCandidatesIDandKey<ID>(map: Map<ID, ICTPhaseCandidate>) {
    for (const [, callCandidate] of map) {
        if (!callCandidate.ICTPubKey || !callCandidate.identity) {
            return false;
        }
    }
    return true;
}
function haveCandidatesNoOpenNonce<ID>(map: Map<ID, ICTPhaseCandidate>) {
    for (const [, callCandidate] of map) {
        if (callCandidate.responseNonce) {
            return false;
        }
    }
    return true;
}

function mapsHaveSameKeys<K, V1, V2>(map1: Map<K, V1>, map2: Map<K, V2>) {
    // Get arrays of keys from both maps
    const keys1 = [...map1.keys()];
    const keys2 = [...map2.keys()];

    console.log(keys1, keys2);
    // Check if the arrays of keys are equal
    if (keys1.length !== keys2.length) {
        return false; // Maps have a different number of keys
    }

    // Sort the arrays of keys (optional, to ensure order doesn't matter)
    keys1.sort();
    keys2.sort();

    // Check if the sorted arrays of keys are equal

    return equal(keys1, keys2); // Maps have the same keys
}
