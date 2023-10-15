import { Candidate, Identity } from '../ICTPhase/ICTPhase';
import {
    deriveDHSecret,
    generateDHPair,
    generateSharedSecret,
} from './Secrets';
import {
    sendGroupLeaderPubKeyDHEventDetail,
    sendGroupLeaderPubKeyDHEventID,
    sendMemberPubKeyDHEventDetail,
    sendMemberPubKeyDHEventID,
    sendSharedSecretEventDetail,
    sendSharedSecretEventID,
} from './Events';
import {
    generateDHJWT,
    generateSharedSecretJWT,
    verifyDHJWT,
    verifySharedSecretJWT,
} from './JWT';
import { MutexMap } from '../Mutex/MutexMap';

class SecretExchangePhaseGroupMember {
    identity: Identity;
    ICTPubKey: CryptoKey;
    dhSecret?: CryptoKey;
    constructor(candidate: Candidate) {
        const identity = candidate.identity;
        if (!identity) {
            throw new Error('');
        }
        this.identity = identity;

        const ICTPubkey = candidate.receivedICTPubKey;
        if (!ICTPubkey) {
            throw new Error('');
        }
        this.ICTPubKey = ICTPubkey;
    }
}

class SecretExchangePhaseSelf<ID> {
    ICTPhaseKeyPairs: MutexMap<ID, CryptoKeyPair>;
    DHKeyPairs: MutexMap<ID, CryptoKeyPair>;

    isGroupLeader: boolean;
    groupLeaderID?: ID;

    constructor() {
        this.ICTPhaseKeyPairs = new MutexMap();
        this.DHKeyPairs = new MutexMap();
        this.isGroupLeader = false;
    }
}

function convertCallCandidateMaptoMemberMutexMap<ID>(
    candidateMap: Map<ID, Candidate>
) {
    return new MutexMap(
        new Map(
            [...candidateMap].map(([candidateID, callCandidate]) => [
                candidateID,
                new SecretExchangePhaseGroupMember(callCandidate),
            ])
        )
    );
}

export class SecretExchangePhase<ID> extends EventTarget {
    self: SecretExchangePhaseSelf<ID>;
    groupMemberMap?: MutexMap<ID, SecretExchangePhaseGroupMember>;
    sharedSecret?: CryptoKey;

    constructor() {
        super();
        this.self = new SecretExchangePhaseSelf();
    }

    async setupGroupLeader(
        candidateMap: Map<ID, Candidate>,
        ICTKeyPairs: Map<ID, CryptoKeyPair>
    ) {
        this.groupMemberMap =
            convertCallCandidateMaptoMemberMutexMap<ID>(candidateMap);
        this.self.ICTPhaseKeyPairs = new MutexMap(ICTKeyPairs);
        this.self.isGroupLeader = true;
        this.sharedSecret = await generateSharedSecret();

        this.getDHParametersGroupLeader();
    }

    setupGroupMember(
        candidateMap: Map<ID, Candidate>,
        ICTKeyPairs: Map<ID, CryptoKeyPair>,
        groupLeaderId: ID,
        GroupLeaderDHJWT: string
    ) {
        this.groupMemberMap =
            convertCallCandidateMaptoMemberMutexMap<ID>(candidateMap);
        this.self.ICTPhaseKeyPairs = new MutexMap(ICTKeyPairs);
        this.self.groupLeaderID = groupLeaderId;

        this.setGroupLeaderDHParameter(GroupLeaderDHJWT);
    }

    async getDHParametersGroupLeader() {
        if (!this.groupMemberMap) {
            throw Error('ICT Phase results not passed');
        }
        // generate the Keys
        for (const [calleeID] of await this.groupMemberMap.exportToMap()) {
            try {
                const DHKeyPair = await generateDHPair();
                this.self.DHKeyPairs.set(calleeID, DHKeyPair);
            } catch (error) {
                throw new Error('Could not generate DH Keys');
            }
        }
        this.sendDHParametersGroupLeader();
    }
    async sendDHParametersGroupLeader() {
        if (!this.groupMemberMap) {
            throw Error('ICT Phase results not passed');
        }

        // send the Public Key

        for (const [calleeID] of await this.groupMemberMap.exportToMap()) {
            const ICTKeyPair = await this.self.ICTPhaseKeyPairs.get(calleeID);

            if (!ICTKeyPair) {
                throw new Error(`No ICT Keypair for ${calleeID}`);
            }

            const DHKeyPair = await this.self.DHKeyPairs.get(calleeID);
            if (!DHKeyPair) {
                throw new Error(`No DH Keypair for ${calleeID}`);
            }

            const DHJWT = await generateDHJWT(ICTKeyPair, DHKeyPair.publicKey);

            const newSendGroupLeaderPubKeyDHEvent = new CustomEvent<
                sendGroupLeaderPubKeyDHEventDetail<ID>
            >(sendGroupLeaderPubKeyDHEventID, {
                detail: {
                    time: Date.now(),
                    target: calleeID,
                    jwt: DHJWT,
                },
            });
            dispatchEvent(newSendGroupLeaderPubKeyDHEvent);
        }
    }

    async setMemberDHParameters(origin: ID, DHJWT: string) {
        if (!this.groupMemberMap) {
            throw new Error('ICT Phase results not passed');
        }
        const member = await this.groupMemberMap.get(origin);

        if (!member) {
            console.log(`Ignore DHJWT from unknown origin ${origin}`);
            return;
        }
        const selfDHKeyPair = await this.self.DHKeyPairs.get(origin);
        if (!selfDHKeyPair) {
            throw new Error('');
        }

        const memberDHPubKey = await verifyDHJWT(member.ICTPubKey, DHJWT);

        const DHSecret = await deriveDHSecret(selfDHKeyPair, memberDHPubKey);

        member.dhSecret = DHSecret;

        if (await hasEveryMemberDHSecret(this.groupMemberMap)) {
            this.sendSharedSecret();
        }
    }

    async setGroupLeaderDHParameter(DHJWT: string) {
        if (!this.groupMemberMap) {
            throw new Error('ICT Phase results not passed');
        }
        const groupLeaderID = this.self.groupLeaderID;
        if (!groupLeaderID) {
            throw new Error('');
        }
        const selfDHKeyPair = await this.self.DHKeyPairs.get(groupLeaderID);
        if (!selfDHKeyPair) {
            throw new Error('');
        }

        const groupLeader = await this.groupMemberMap.get(groupLeaderID);

        if (!groupLeader) {
            throw new Error('');
        }

        const memberDHPubKey = await verifyDHJWT(groupLeader.ICTPubKey, DHJWT);

        const DHSecret = await deriveDHSecret(selfDHKeyPair, memberDHPubKey);

        groupLeader.dhSecret = DHSecret;

        this.getDHParametersMember();
    }

    async getDHParametersMember() {
        const groupLeaderID = this.self.groupLeaderID;
        if (!groupLeaderID) {
            throw Error('ICT Phase results not passed');
        }
        // generate the Keys

        const DHKeyPair = await generateDHPair();
        this.self.DHKeyPairs.set(groupLeaderID, DHKeyPair);

        this.sendMemberDHParameters();
    }

    async sendMemberDHParameters() {
        const groupLeaderID = this.self.groupLeaderID;
        if (!groupLeaderID) {
            throw Error('ICT Phase results not passed');
        }

        const ICTKeyPair = await this.self.ICTPhaseKeyPairs.get(groupLeaderID);

        if (!ICTKeyPair) {
            throw new Error(`No ICT Keypair for ${groupLeaderID}`);
        }

        const DHKeypair = await this.self.DHKeyPairs.get(groupLeaderID);
        if (!DHKeypair) {
            throw new Error(`No DH Keypair for ${groupLeaderID}`);
        }

        const DHJWT = await generateDHJWT(ICTKeyPair, DHKeypair.publicKey);

        const newSendMemberPubKeyDHEvent = new CustomEvent<
            sendMemberPubKeyDHEventDetail<ID>
        >(sendMemberPubKeyDHEventID, {
            detail: {
                time: Date.now(),
                target: groupLeaderID,
                jwt: DHJWT,
            },
        });
        dispatchEvent(newSendMemberPubKeyDHEvent);
    }

    async sendSharedSecret() {
        if (!this.groupMemberMap) {
            throw new Error('');
        }
        for (const [
            memberID,
            member,
        ] of await this.groupMemberMap.exportToMap()) {
            const dhSecret = member.dhSecret;
            if (!dhSecret) {
                throw new Error('');
            }

            const sharedSecret = this.sharedSecret;
            if (!sharedSecret) {
                throw new Error('');
            }
            const encSharedSecretJWT = await generateSharedSecretJWT(
                dhSecret,
                sharedSecret
            );

            const newSendSharedSecretEvent = new CustomEvent<
                sendSharedSecretEventDetail<ID>
            >(sendSharedSecretEventID, {
                detail: {
                    time: Date.now(),
                    target: memberID,
                    jwt: encSharedSecretJWT,
                },
            });
            dispatchEvent(newSendSharedSecretEvent);
        }
    }

    async getSharedSecret(origin: ID, sharedSecretJWT: string) {
        const groupLeaderID = this.self.groupLeaderID;
        if (!groupLeaderID) {
            throw Error('ICT Phase results not passed');
        }

        if (origin !== groupLeaderID) {
            console.log(`Ignore shared secret from ${origin}`);
            return;
        }

        if (!this.groupMemberMap) {
            throw new Error('');
        }

        const groupLeader = await this.groupMemberMap.get(groupLeaderID);

        if (!groupLeader) {
            throw new Error('');
        }
        const DHSecret = groupLeader.dhSecret;
        if (!DHSecret) {
            throw new Error('');
        }

        const sharedSecret = await verifySharedSecretJWT(
            DHSecret,
            sharedSecretJWT
        );

        this.sharedSecret = sharedSecret;
    }
}

async function hasEveryMemberDHSecret<ID>(
    groupMemberMap: MutexMap<ID, SecretExchangePhaseGroupMember>
) {
    for (const [, member] of await groupMemberMap.exportToMap()) {
        if (!member.dhSecret) {
            return false;
        }
    }
    return true;
}
