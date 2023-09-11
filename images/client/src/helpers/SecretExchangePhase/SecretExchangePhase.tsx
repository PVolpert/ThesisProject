import { ICTPhaseCandidate } from '../ICTPhase/ICTPhase';
import { deriveDHSecret, generateDHPair, generateSharedSecret } from './Secrets';
import { sendPubKeyDHEventDetail, sendPubKeyDHEventID } from './Events';
import { generateDHJWT, verifyDHJWT } from './JWT';

class SecretExchangePhaseGroupMember {
    identity: { name: string; email: string };
    ICTPubKey: CryptoKey;
    dhSecret?: CryptoKey;
    constructor(candidate: ICTPhaseCandidate) {
        const identity = candidate.identity;
        if (!identity) {
            throw new Error('');
        }
        this.identity = identity;

        const ICTPubkey = candidate.ICTPubKey;
        if (!ICTPubkey) {
            throw new Error('');
        }
        this.ICTPubKey = ICTPubkey;
    }
}

class SecretExchangePhaseSelf<ID> {
    ICTPhaseKeyPairs: Map<ID, CryptoKeyPair>;
    DHKeyPairs: Map<ID, CryptoKeyPair>;

    isGroupLeader: boolean;
    groupLeaderID?: ID;

    constructor() {
        this.ICTPhaseKeyPairs = new Map();
        this.DHKeyPairs = new Map();
        this.isGroupLeader = false;
    }
}

function convertCallCandidateMaptoGroupMemberMap<ID>(
    candidateMap: Map<ID, ICTPhaseCandidate>
) {
    return new Map(
        [...candidateMap].map(([candidateID, callCandidate]) => [
            candidateID,
            new SecretExchangePhaseGroupMember(callCandidate),
        ])
    );
}

export class SecretExchangePhase<ID> extends EventTarget {
    self: SecretExchangePhaseSelf<ID>;
    groupMemberMap?: Map<ID, SecretExchangePhaseGroupMember>;
    sharedSecret?: CryptoKey

    constructor() {
        super();
        this.self = new SecretExchangePhaseSelf();
    }

    async setupGroupLeader(
        candidateMap: Map<ID, ICTPhaseCandidate>,
        ICTKeyPairs: Map<ID, CryptoKeyPair>
    ) {
        this.groupMemberMap =
            convertCallCandidateMaptoGroupMemberMap<ID>(candidateMap);
        this.self.ICTPhaseKeyPairs = ICTKeyPairs;
        this.self.isGroupLeader = true;
        this.sharedSecret = await generateSharedSecret()

        this.getDHParametersGroupLeader();
    }



    setupGroupMember(
        candidateMap: Map<ID, ICTPhaseCandidate>,
        ICTKeyPairs: Map<ID, CryptoKeyPair>,
        groupLeaderId: ID,
        GroupLeaderDHJWT: string
    ) {
        this.groupMemberMap =
            convertCallCandidateMaptoGroupMemberMap<ID>(candidateMap);
        this.self.ICTPhaseKeyPairs = ICTKeyPairs;
        this.self.groupLeaderID = groupLeaderId;

        this.setGroupLeaderDHParameter(GroupLeaderDHJWT);
    }

    async getDHParametersGroupLeader() {
        if (!this.groupMemberMap) {
            throw Error('ICT Phase results not passed');
        }
        // generate the Keys
        for (const [calleeID] of this.groupMemberMap) {
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

        for (const [calleeID] of this.groupMemberMap) {
            const ICTKeyPair = this.self.ICTPhaseKeyPairs.get(calleeID);

            if (!ICTKeyPair) {
                throw new Error(`No ICT Keypair for ${calleeID}`);
            }

            const DHKeyPair = this.self.DHKeyPairs.get(calleeID);
            if (!DHKeyPair) {
                throw new Error(`No DH Keypair for ${calleeID}`);
            }

            const DHJWT = await generateDHJWT(ICTKeyPair, DHKeyPair.publicKey);

            const newSendPubKeyDHEvent = new CustomEvent<
                sendPubKeyDHEventDetail<ID>
            >(sendPubKeyDHEventID, {
                detail: {
                    time: Date.now(),
                    target: calleeID,
                    jwt: DHJWT,
                },
            });
            dispatchEvent(newSendPubKeyDHEvent);
        }
    }

    async setMemberDHParameters(origin: ID, DHJWT: string) {
        if (!this.groupMemberMap) {
            throw new Error('ICT Phase results not passed');
        }
        const member = this.groupMemberMap.get(origin);

        if (!member) {
            console.log(`Ignore DHJWT from unknown origin ${origin}`);
            return;
        }
        const selfDHKeyPair = this.self.DHKeyPairs.get(origin);
        if (!selfDHKeyPair) {
            throw new Error('');
        }

        const memberDHPubKey = await verifyDHJWT(member.ICTPubKey, DHJWT);

        const DHSecret = await deriveDHSecret(selfDHKeyPair, memberDHPubKey);

        member.dhSecret = DHSecret;

        if (hasEveryMemberDHSecret(this.groupMemberMap)) {
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
        const selfDHKeyPair = this.self.DHKeyPairs.get(groupLeaderID);
        if (!selfDHKeyPair) {
            throw new Error('');
        }

        const groupLeader = this.groupMemberMap.get(groupLeaderID);

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

        const ICTKeyPair = this.self.ICTPhaseKeyPairs.get(groupLeaderID);

        if (!ICTKeyPair) {
            throw new Error(`No ICT Keypair for ${groupLeaderID}`);
        }

        const DHKeypair = this.self.DHKeyPairs.get(groupLeaderID);
        if (!DHKeypair) {
            throw new Error(`No DH Keypair for ${groupLeaderID}`);
        }

        const DHJWT = await generateDHJWT(ICTKeyPair, DHKeypair.publicKey);

        const newSendPubKeyDHEvent = new CustomEvent<
            sendPubKeyDHEventDetail<ID>
        >(sendPubKeyDHEventID, {
            detail: {
                time: Date.now(),
                target: groupLeaderID,
                jwt: DHJWT,
            },
        });
        dispatchEvent(newSendPubKeyDHEvent);
    }

    async sendSharedSecret() {
        if (!this.groupMemberMap) {
            throw new Error('');
        }
        for (const [memberID, member] of this.groupMemberMap) {
            const dhSecret = member.dhSecret;
            const sharedSecret = this.sharedSecret
            if (!sharedSecret) {
                throw new Error('')
            }
            const encSharedSecretJWT = 
        }
    }

    getSharedSecret() {}
}

function hasEveryMemberDHSecret<ID>(
    groupMemberMap: Map<ID, SecretExchangePhaseGroupMember>
) {
    for (const [, member] of groupMemberMap) {
        if (!member.dhSecret) {
            return false;
        }
    }
    return true;
}
