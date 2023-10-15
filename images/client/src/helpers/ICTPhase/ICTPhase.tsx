import {
    sendICTMessageEventDetail,
    sendCandidatesEventDetail,
    startSecretEventDetail,
    EventID,
    ICTMessageType,
    NotifyMessageType,
    sendNotifyMessageEventDetail,
    OPNMessageType,
    sendOPNMessageEventDetail,
    verifyEventDetail,
    VerifyEventType,
} from './Events';
import {
    generateICTAnswerMessage,
    generateICTOfferJWT,
    verifyICTAnswerJWT,
    verifyICTOfferJWT,
} from './ICTPhaseJWT';
import { createKeyPair, getICT } from './ICT';
import { TokenSet } from '../../store/slices/ICTAccessTokenSlice';
import { OpenIDProviderInfo } from './OpenIDProvider';
import { MutexMap } from '../Mutex/MutexMap';
import { ReactNode } from 'react';

export type OPNMap = MutexMap<string, string>;
export interface Identity {
    name: string;
    mail: string;
    issName: string;
    issImg: ReactNode;
}

class ICTPhaseSelf<ID> {
    // KeyPair used for signing messages
    issuedICTKeyPairsMap: MutexMap<ID, CryptoKeyPair>;
    //
    issuedOPNMap: MutexMap<ID, OPNMap>;
    trustedOIDCProviders?: OpenIDProviderInfo[];

    constructor() {
        this.issuedICTKeyPairsMap = new MutexMap();
        this.issuedOPNMap = new MutexMap();
    }
}

export class Candidate {
    // Saved verified Public Key of Call Partner
    receivedICTPubKey?: CryptoKey;
    // Saved identity of Call Partner
    identity?: Identity;
    receivedOPNMap: OPNMap;

    constructor() {
        this.receivedOPNMap = new MutexMap();
    }
}

class ICTPhaseValues<ID> extends EventTarget {
    protected self: ICTPhaseSelf<ID>;
    protected candidatesMap: MutexMap<ID, Candidate>;

    constructor() {
        super();
        this.self = new ICTPhaseSelf();
        this.candidatesMap = new MutexMap();
    }

    async getICTPhaseValues() {
        // Check if all candidates have ID and Key
        if (!(await haveCandidatesIDandKey(this.candidatesMap))) {
            throw new Error('not all candidates have an assigned ');
        }
        return {
            keyPairs: this.self.issuedICTKeyPairsMap,
            candidatesMap: this.candidatesMap,
        };
    }
}

class ICTPhaseEvents<ID> extends ICTPhaseValues<ID> {
    constructor() {
        super();
    }

    protected async issueVerification(type: VerifyEventType) {
        // Test if this is the last needed Call Answer via comparing received answers with original
        const candidateMap = await this.candidatesMap.exportToMap();
        // Trigger an verifyCallAnswer event
        const newVerifyCallAnswersEvent = new CustomEvent<
            verifyEventDetail<ID>
        >(EventID.verify, {
            detail: {
                time: Date.now(),
                candidates: candidateMap,
                type,
            },
        });
        this.dispatchEvent(newVerifyCallAnswersEvent);
    }

    protected sendICTMessage(
        target: ID,
        ictMessage: string,
        type: ICTMessageType
    ) {
        const newSendICTMessageEvent = new CustomEvent<
            sendICTMessageEventDetail<ID>
        >(EventID.sendICTMessage, {
            detail: {
                time: Date.now(),
                target,
                jwt: ictMessage,
                type,
            },
        });
        this.dispatchEvent(newSendICTMessageEvent);
    }

    protected sendNotifyMessage(target: ID, type: NotifyMessageType) {
        const newSendNotifyMessageEvent = new CustomEvent<
            sendNotifyMessageEventDetail<ID>
        >(EventID.notify, {
            detail: {
                time: Date.now(),
                target,
                type,
            },
        });
        this.dispatchEvent(newSendNotifyMessageEvent);
    }

    protected async sendOPNMessage(
        target: ID,
        OPNMap: OPNMap,
        type: OPNMessageType
    ) {
        const newSendOPNMessageEvent = new CustomEvent<
            sendOPNMessageEventDetail<ID>
        >(EventID.sendOPNMessage, {
            detail: {
                time: Date.now(),
                target,
                OPNMap: await OPNMap.exportToMap(),
                type,
            },
        });
        this.dispatchEvent(newSendOPNMessageEvent);
    }

    protected sendCandidates(target: ID, candidateIDs: ID[]) {
        const newSendCandidatesEvent = new CustomEvent<
            sendCandidatesEventDetail<ID>
        >(EventID.sendCandidates, {
            detail: {
                time: Date.now(),
                target,
                candidateIDs,
            },
        });
        this.dispatchEvent(newSendCandidatesEvent);
    }
}

class ICTPhaseCaller<ID> extends ICTPhaseEvents<ID> {
    constructor() {
        super();
    }
    // Function to start a conference as the group leader
    async startConference(targets: ID[]) {
        // Fill the candidate Map
        targets.forEach((target) => {
            this.candidatesMap.set(target, new Candidate());
        });

        // Trigger an sendCallOffer event for each target
        targets.forEach((target) => {
            this.sendNotifyMessage(target, 'Conference-Offer');
        });
    }

    // Function to start a call as the caller
    async startCall(target: ID) {
        try {
            // Fill the candidate Map
            this.candidatesMap.set(target, new Candidate());
            this.sendNotifyMessage(target, 'Call-Offer');
        } catch (error) {
            console.error(`Starting Call Failed because ${error}`);
        }
    }

    // Set Incoming Call Answer
    async setCallAnswer(origin: ID, calleeOPNMap: Map<string, string>) {
        try {
            // Test if call answer message comes from a known origin
            const candidate = await this.candidatesMap.get(origin);
            if (!candidate) {
                // Ignore Call Answers from unknown origin
                console.log(`Ignore call answer from unknown origin ${origin}`);
                return;
            }

            candidate.receivedOPNMap = new MutexMap(calleeOPNMap);

            // Wait for all Candidates
            if (await haveCandidatesFilledOPNMap(this.candidatesMap)) {
                await this.issueVerification('OPN');
            }
        } catch (error) {
            console.error(`Could not set Call Answer because ${error}`);
        }
    }

    // Called after Callee verification
    async setCallerParameters(
        trustedOIDCProviders: OpenIDProviderInfo[],
        getICTParameters: {
            openIDProviderInfo: OpenIDProviderInfo;
            tokenSet: TokenSet;
            targets: ID[];
        }[]
    ) {
        try {
            // Save the trusted OIDCProviders for later
            this.self.trustedOIDCProviders = trustedOIDCProviders;
            // Generate OPN
            this.candidatesMap.forEach((_, target) => {
                const newOPNMap = generateOPNMap(trustedOIDCProviders);
                this.self.issuedOPNMap.set(target, newOPNMap);
            });

            await this.getICTOffers(getICTParameters);
        } catch (error) {
            throw error;
        }
    }

    protected async getICTOffers(
        getICTParameters: {
            openIDProviderInfo: OpenIDProviderInfo;
            tokenSet: TokenSet;
            targets: ID[];
        }[]
    ) {
        const icts = await this.getICTs(getICTParameters);
        this.saveICTsKeyPair(icts);

        const ictOffers = await this.getJWTPairs(icts);
        // Trigger sendICT Event
        ictOffers.forEach(({ target, ictOffer }) => {
            this.sendICTMessage(target, ictOffer, 'ICT-Offer');
        });
    }

    protected async getICTs(
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

                    if (!ict) throw new Error('Unable to acquire ict');

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

    protected saveICTsKeyPair(
        icts: {
            targets: ID[];
            keyPair: CryptoKeyPair;
        }[]
    ) {
        icts.forEach(({ targets, keyPair }) => {
            targets.forEach((target) => {
                this.self.issuedICTKeyPairsMap.set(target, keyPair);
            });
        });
    }

    protected async getJWTPairs(
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
                            const candidate = await this.candidatesMap.get(
                                target
                            );
                            if (!candidate) throw new Error('');

                            const receivedOPN = candidate.receivedOPNMap;

                            const nonce = await receivedOPN.get(
                                oidcProvider.name
                            );
                            const issuedOPN = await this.self.issuedOPNMap.get(
                                target
                            );
                            if (!nonce)
                                throw new Error(
                                    `missing nonce for target ${target}`
                                );

                            if (!issuedOPN)
                                throw new Error('issuedOPN is not assigned');

                            // Generate JWT
                            const jwtOffer = await generateICTOfferJWT(
                                keyPair,
                                nonce,
                                ict,
                                issuedOPN
                            );

                            return { target, ictOffer: jwtOffer };
                        })
                    );
                })
            )
        ).flat();
    }

    async setICTAnswer(origin: ID, ictAnswer: string) {
        try {
            const candidate = await this.candidatesMap.get(origin);
            if (!candidate) {
                console.log(`Ignore ICTAnswer from unknown origin ${origin}`);
                return;
            }
            const issuedOPNMap = await this.self.issuedOPNMap.get(origin);
            const trustedOIDCProviders = this.self.trustedOIDCProviders;
            if (!issuedOPNMap) throw new Error('');
            if (!trustedOIDCProviders) throw new Error('');

            await this.verifyICTAnswer(
                candidate,
                ictAnswer,
                issuedOPNMap,
                trustedOIDCProviders
            );
        } catch (error) {
            console.error(error);
        }
    }

    protected async verifyICTAnswer(
        candidate: Candidate,
        ictAnswer: string,
        issuedOPNMap: OPNMap,
        trustedOIDCProviders: OpenIDProviderInfo[]
    ) {
        const { identity, publicKey: receivedICTPubKey } =
            await verifyICTAnswerJWT(
                ictAnswer,
                issuedOPNMap,
                trustedOIDCProviders
            );

        // Save PubKey for Verifikation
        candidate = { ...candidate, receivedICTPubKey, identity };

        if (await haveCandidatesIDandKey(this.candidatesMap)) {
            await this.issueVerification('Callees');
        }
    }
}

export class ICTPhaseCallee<ID> extends ICTPhaseCaller<ID> {
    constructor() {
        super();
    }

    async receiveCall(origin: ID, trustedOIDCProviders: OpenIDProviderInfo[]) {
        try {
            const newOPNMap = generateOPNMap(trustedOIDCProviders);
            this.self.issuedOPNMap.set(origin, newOPNMap);

            this.self.trustedOIDCProviders = trustedOIDCProviders;

            this.candidatesMap.set(origin, new Candidate());

            // Trigger an sendCallAnswer event
            this.sendOPNMessage(origin, newOPNMap, 'Call-Answer');
        } catch (error) {
            console.error(error);
        }
    }

    // Callee Funktion to verify ICT Offer
    async setICTOffer(origin: ID, ictOffer: string) {
        try {
            const candidate = await this.candidatesMap.get(origin);
            if (!candidate) {
                console.log(`Ignore JWTOffer from unknown source ${origin}`);
                return;
            }
            const trustedOIDCProviders = this.self.trustedOIDCProviders;

            if (!trustedOIDCProviders)
                throw new Error('No trusted OIDCProviders set');

            const issuedOPN = await this.self.issuedOPNMap.get(origin);
            if (!issuedOPN) throw new Error('');

            this.verifyICTOffer(
                candidate,
                ictOffer,
                issuedOPN,
                trustedOIDCProviders
            );
        } catch (error) {
            console.error(error);
        }
    }

    protected async verifyICTOffer(
        candidate: Candidate,
        ictOffer: string,
        issuedOPN: OPNMap,
        trustedOIDCProviders: OpenIDProviderInfo[]
    ) {
        try {
            const { identity, receivedOPNMap, receivedICTPubKey } =
                await verifyICTOfferJWT(
                    ictOffer,
                    issuedOPN,
                    trustedOIDCProviders
                );

            // Save PubKey for Verifikation
            candidate = {
                ...candidate,
                receivedICTPubKey: receivedICTPubKey,
                identity: identity,
                receivedOPNMap: receivedOPNMap,
            };

            this.issueVerification('Caller');
        } catch (error) {
            console.error(error);
        }
    }

    // Callee Post Verify Caller
    async setCalleeParameters(
        oidcProvider: OpenIDProviderInfo,
        tokenSet: TokenSet,
        target: ID
    ) {
        await this.getICTAnswer(oidcProvider, tokenSet, target);
    }
    protected async getICTAnswer(
        selectedOIDCProvider: OpenIDProviderInfo,
        tokenSet: TokenSet,
        target: ID
    ) {
        try {
            // Create and save new ICT Keypair
            const keyPair = await createKeyPair();
            this.self.issuedICTKeyPairsMap.set(target, keyPair);

            // Create new ICT
            const ict = await getICT(keyPair, tokenSet, selectedOIDCProvider);
            if (!ict) throw new Error('ICT verifikation failed');

            const candidate = await this.candidatesMap.get(target);
            if (!candidate)
                throw new Error(`missing canidat for target ${target}`);

            const nonce = await candidate.receivedOPNMap.get(
                selectedOIDCProvider.name
            );
            if (!nonce) throw new Error(`missing nonce for target ${target}`);

            const ictAnswer = await generateICTAnswerMessage(
                keyPair,
                ict,
                nonce
            );

            this.sendICTMessage(target, ictAnswer, 'ICT-Answer');
        } catch (error) {
            console.error(error);
        }
    }
}

export class ICTPhaseGroup<ID> extends ICTPhaseCallee<ID> {
    isGroupLeader: boolean;
    groupLeaderID?: ID;
    confirmationMap: MutexMap<ID, boolean>;

    constructor() {
        super();
        this.isGroupLeader = false;
        this.confirmationMap = new MutexMap();
    }

    async sendCandidatesToPeers() {
        try {
            this.isGroupLeader = true;

            this.candidatesMap.forEach(async (_, currentTarget) => {
                // Get list of targets
                const unfilteredTargets = await this.candidatesMap.keys();
                // Filter out current target
                const candidateIDs = [...unfilteredTargets].filter((target) => {
                    return target !== currentTarget;
                });

                // Load all confirmations
                this.confirmationMap.set(currentTarget, false);

                this.sendCandidates(currentTarget, candidateIDs);
            });
        } catch (error) {
            console.error(error);
        }
    }

    async setCandidates(origin: ID, candidateIDs: ID[]) {
        const candidate = await this.candidatesMap.get(origin);
        if (!candidate) {
            console.log(`Ignore Target list from unknown source ${origin}`);
            return;
        }
        // Sender of candidateIDs list is the group leader
        this.groupLeaderID = origin;

        // Fill up received Candidates
        candidateIDs.forEach((target) => {
            const trustedOIDCProviders = this.self.trustedOIDCProviders;
            if (!trustedOIDCProviders)
                throw new Error('trustedOIDCPeers is undefined');

            this.self.issuedOPNMap.set(
                target,
                generateOPNMap(trustedOIDCProviders)
            );
            this.candidatesMap.set(target, new Candidate());
        });

        await this.sendOPNToPeers(candidateIDs);
    }

    protected async sendOPNToPeers(candidateIDs: ID[]) {
        try {
            candidateIDs.forEach(async (target) => {
                const issuedOPNMap = await this.self.issuedOPNMap.get(target);
                if (!issuedOPNMap) throw new Error('');

                this.sendOPNMessage(target, issuedOPNMap, 'Peer-OPN');
            });
        } catch (error) {
            console.error(error);
        }
    }

    async setPeerOPN(origin: ID, peerOPNMap: Map<string, string>) {
        try {
            const candidate = await this.candidatesMap.get(origin);
            if (!candidate) {
                // Ignore Call Answers from unknown origin
                console.log(
                    `Ignoring peer answer from unknown origin ${origin}`
                );
                return;
            }

            // Set the OPsMap from origin
            candidate.receivedOPNMap = new MutexMap(peerOPNMap);

            // Test if this is the last needed Call Answer via comparing received answers with original
            if (await haveCandidatesFilledOPNMap(this.candidatesMap)) {
                await this.issueVerification('Peer-OPN');
            }
        } catch (error) {
            console.error(error);
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
            jwtPairs.forEach(({ target, ictOffer: ictTransfer }) => {
                this.sendICTMessage(target, ictTransfer, 'ICT-Transfer');
            });
        } catch (error) {
            console.log(error);
        }
    }
    async setICTTransfer(origin: ID, ictTransfer: string) {
        try {
            const candidate = await this.candidatesMap.get(origin);
            if (!candidate) {
                console.log(`Ignore PeerAnswer from unknown origin ${origin}`);
                return;
            }

            const issuedOPNMap = await this.self.issuedOPNMap.get(origin);
            const trustedOIDCProviders = this.self.trustedOIDCProviders;
            if (!issuedOPNMap) throw new Error('');

            if (!trustedOIDCProviders)
                throw new Error('No trusted OIDCProviders set');

            const verifiedICTValues = await verifyICTAnswerJWT(
                ictTransfer,
                issuedOPNMap,
                trustedOIDCProviders
            );
            if (!verifiedICTValues)
                throw new Error('Verification of JWT failed');

            const { identity, publicKey } = verifiedICTValues;

            // Save PubKey for Verifikation
            candidate.receivedICTPubKey = publicKey;
            // Save Identity for Display
            candidate.identity = identity;

            // Trigger Event if all Targets have send their ICT Answer
            if (await haveCandidatesIDandKey(this.candidatesMap)) {
                this.issueVerification('Peers');
            }
        } catch (error) {
            console.error(error);
        }
    }

    protected async getConfirmation() {
        try {
            const groupLeaderID = this.groupLeaderID;

            if (!groupLeaderID)
                throw new Error('Confirmation without groupLeader');

            this.sendNotifyMessage(groupLeaderID, 'Confirmation');
        } catch (error) {
            console.error(error);
        }
    }

    async setConfirmation(origin: ID) {
        try {
            const callCandidate = await this.candidatesMap.get(origin);

            if (!callCandidate) {
                console.log(
                    `Ignore Confirmation from unknown origin ${origin}`
                );
                return;
            }

            if (await haveCandidatesConfirmed(this.confirmationMap)) {
                const callees = await this.candidatesMap.exportToMap();
                const keyPairs =
                    await this.self.issuedICTKeyPairsMap.exportToMap();
                const newStartSecretPhase = new CustomEvent<
                    startSecretEventDetail<ID>
                >(EventID.startSecret, {
                    detail: {
                        time: Date.now(),
                        callees,
                        keyPairs,
                    },
                });
                this.dispatchEvent(newStartSecretPhase);
            }
        } catch (error) {
            // Trigger Event if
        }
    }
}

function generateOPNMap(oidcProviders: OpenIDProviderInfo[]) {
    const OPNMap: OPNMap = new MutexMap();
    oidcProviders.forEach((oidcProvider) => {
        const nonce = generateNonce();
        OPNMap.set(oidcProvider.issuer, nonce);
    });
    return OPNMap;
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

async function createCandidateCheckerFunction<ID, Value>(
    candidateMap: MutexMap<ID, Value>,
    condition: (candidate: Value) => Promise<boolean>
) {
    for (const [, candidate] of await candidateMap.exportToMap()) {
        if (!(await condition(candidate))) {
            return false;
        }
    }
    return true;
}

async function haveCandidatesFilledOPNMap<ID>(
    candidateMap: MutexMap<ID, Candidate>
) {
    return createCandidateCheckerFunction(candidateMap, async (candidate) => {
        return (await candidate.receivedOPNMap.size()) > 0;
    });
}
async function haveCandidatesConfirmed<ID>(
    confirmationMap: MutexMap<ID, boolean>
) {
    return createCandidateCheckerFunction(
        confirmationMap,
        async (isConfirmed) => {
            return isConfirmed;
        }
    );
}

async function haveCandidatesIDandKey<ID>(
    candidateMap: MutexMap<ID, Candidate>
) {
    return createCandidateCheckerFunction(candidateMap, async (candidate) => {
        return !!candidate.receivedICTPubKey && !!candidate.identity;
    });
}
