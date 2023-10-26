import { Candidate, Identity } from '../ICTPhase/ICTPhase';
import {
    deriveDHSecret,
    generateDHPair,
    generateSharedSecret,
} from './Secrets';

import {
    generateDHJWT,
    generateSharedSecretJWT,
    verifyDHJWT,
    verifySharedSecretJWT,
} from './SecretExchangePhaseJWT';
import { MutexMap } from '../Mutex/MutexMap';
import {
    sendSecretExchangeMessageType,
    sendSecretExchangeEventDetail,
    sendSecretExchangeEventID,
    startSFUEventDetail,
    startSFUEventID,
} from './Events';

export class SecretExchangePhaseGroupMember {
    identity: Identity;
    receivedICTPubKey: CryptoKey;
    negotiatedDHSecret?: CryptoKey;
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
        this.receivedICTPubKey = ICTPubkey;
    }
}

class SecretExchangePhaseSelf<ID> {
    ICTPhaseKeyPairs: MutexMap<ID, CryptoKeyPair>;
    issuedDHKeyPairs: MutexMap<ID, CryptoKeyPair>;

    isGroupLeader: boolean;
    groupLeaderID?: ID;

    constructor() {
        this.ICTPhaseKeyPairs = new MutexMap();
        this.issuedDHKeyPairs = new MutexMap();
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

class SecretExchangePhaseValues<ID> extends EventTarget {
    protected self: SecretExchangePhaseSelf<ID>;
    protected groupMemberMap?: MutexMap<ID, SecretExchangePhaseGroupMember>;
    protected sharedSecret?: CryptoKey;

    constructor() {
        super();
        this.self = new SecretExchangePhaseSelf();
    }

    async getSecretExchangePhaseValues() {
        if (!this.sharedSecret || !this.groupMemberMap) {
            throw new Error('Not all values prepared');
        }
        return {
            sharedSecret: this.sharedSecret,
            groupMemberMap: this.groupMemberMap,
        };
    }
}

class SecretExchangePhaseEvents<ID> extends SecretExchangePhaseValues<ID> {
    protected sendSecretExchangeMessage(
        target: ID,
        jwt: string,
        type: sendSecretExchangeMessageType
    ) {
        const newSendSecretExchangeMessageEvent = new CustomEvent<
            sendSecretExchangeEventDetail<ID>
        >(sendSecretExchangeEventID, {
            detail: {
                time: Date.now(),
                target,
                jwt,
                type,
            },
        });
        this.dispatchEvent(newSendSecretExchangeMessageEvent);
    }
    protected startSFUMessage() {
        const newSendSecretExchangeMessageEvent =
            new CustomEvent<startSFUEventDetail>(startSFUEventID, {
                detail: {
                    time: Date.now(),
                },
            });
        this.dispatchEvent(newSendSecretExchangeMessageEvent);
    }
}

export class SecretExchangePhase<ID> extends SecretExchangePhaseEvents<ID> {
    async setupGroupLeader(
        candidateMap: Map<ID, Candidate>,
        ICTKeyPairs: Map<ID, CryptoKeyPair>
    ) {
        this.groupMemberMap =
            convertCallCandidateMaptoMemberMutexMap<ID>(candidateMap);
        this.self.ICTPhaseKeyPairs = new MutexMap(ICTKeyPairs);
        this.self.isGroupLeader = true;

        this.createDHParametersGroupLeader();
    }

    async setupGroupMember(
        candidateMap: Map<ID, Candidate>,
        ICTKeyPairs: Map<ID, CryptoKeyPair>,
        groupLeaderId: ID
    ) {
        this.groupMemberMap =
            convertCallCandidateMaptoMemberMutexMap<ID>(candidateMap);
        this.self.ICTPhaseKeyPairs = new MutexMap(ICTKeyPairs);
        this.self.groupLeaderID = groupLeaderId;
        const DHKeyPair = await generateDHPair();
        await this.self.issuedDHKeyPairs.set(groupLeaderId, DHKeyPair);
    }

    protected async createDHParametersGroupLeader() {
        if (!this.groupMemberMap) {
            throw Error('ICT Phase results not passed');
        }
        // generate the Keys
        for (const [memberId] of await this.groupMemberMap.exportToMap()) {
            try {
                const DHKeyPair = await generateDHPair();
                this.self.issuedDHKeyPairs.set(memberId, DHKeyPair);
            } catch (error) {
                throw new Error('Could not generate DH Keys');
            }
        }
        this.sendDHParametersGroupLeader();
    }
    protected async sendDHParametersGroupLeader() {
        if (!this.groupMemberMap) {
            throw Error('ICT Phase results not passed');
        }

        // send the Public Key
        // ? For Renegotiation you can simplify that
        for (const [memberId] of await this.groupMemberMap.exportToMap()) {
            const ICTKeyPair = await this.self.ICTPhaseKeyPairs.get(memberId);

            if (!ICTKeyPair) {
                throw new Error(`No ICT Keypair for ${memberId}`);
            }

            const issuedDHKeyPair = await this.self.issuedDHKeyPairs.get(
                memberId
            );
            if (!issuedDHKeyPair) {
                throw new Error(`No DH Keypair for ${memberId}`);
            }

            const DHJWT = await generateDHJWT(
                ICTKeyPair,
                issuedDHKeyPair.publicKey
            );

            this.sendSecretExchangeMessage(
                memberId,
                DHJWT,
                'sendGroupLeaderPubKeyDH'
            );
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
        const selfDHKeyPair = await this.self.issuedDHKeyPairs.get(origin);
        if (!selfDHKeyPair) {
            throw new Error('');
        }

        const memberDHPubKey = await verifyDHJWT(
            member.receivedICTPubKey,
            DHJWT
        );

        const DHSecret = await deriveDHSecret(selfDHKeyPair, memberDHPubKey);

        member.negotiatedDHSecret = DHSecret;

        await this.groupMemberMap.set(origin, member);

        if (await hasEveryMemberDHSecret(this.groupMemberMap)) {
            console.log('Exchanged DH Secret with every Group Member');
            this.sendSharedSecret();
        }
    }

    async setGroupLeaderDHParameter(origin: ID, DHJWT: string) {
        if (!this.groupMemberMap) {
            throw new Error('ICT Phase results not passed');
        }
        const groupLeaderID = this.self.groupLeaderID;
        if (!groupLeaderID || groupLeaderID !== origin) {
            throw new Error('');
        }
        // Retrieve own DH KeyPair
        const issuedDHKeyPair = await this.self.issuedDHKeyPairs.get(
            groupLeaderID
        );
        if (!issuedDHKeyPair) {
            throw new Error('');
        }

        const groupLeader = await this.groupMemberMap.get(groupLeaderID);

        if (!groupLeader) {
            throw new Error('');
        }

        // Extract opposite site PubKey
        const receivedDHPubKey = await verifyDHJWT(
            groupLeader.receivedICTPubKey,
            DHJWT
        );

        await this.groupMemberMap.set(groupLeaderID, {
            ...groupLeader,
            negotiatedDHSecret: await deriveDHSecret(
                issuedDHKeyPair,
                receivedDHPubKey
            ),
        });

        this.sendMemberDHParameters();
    }

    protected async sendMemberDHParameters() {
        const groupLeaderID = this.self.groupLeaderID;
        if (!groupLeaderID) {
            throw Error('ICT Phase results not passed');
        }

        const ICTKeyPair = await this.self.ICTPhaseKeyPairs.get(groupLeaderID);

        if (!ICTKeyPair) {
            throw new Error(`No ICT Keypair for ${groupLeaderID}`);
        }

        const DHKeypair = await this.self.issuedDHKeyPairs.get(groupLeaderID);
        if (!DHKeypair) {
            throw new Error(`No DH Keypair for ${groupLeaderID}`);
        }

        const DHJWT = await generateDHJWT(ICTKeyPair, DHKeypair.publicKey);

        this.sendSecretExchangeMessage(
            groupLeaderID,
            DHJWT,
            'sendMemberPubKeyDH'
        );
    }

    async sendSharedSecret() {
        if (!this.groupMemberMap) {
            throw new Error('');
        }

        // Generate a new shared secret every time
        this.sharedSecret = await generateSharedSecret();

        for (const [
            memberID,
            member,
        ] of await this.groupMemberMap.exportToMap()) {
            const dhSecret = member.negotiatedDHSecret;
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

            this.sendSecretExchangeMessage(
                memberID,
                encSharedSecretJWT,
                'sendSharedSecret'
            );
        }
        this.startSFUMessage();
    }

    async setSharedSecret(origin: ID, sharedSecretJWT: string) {
        const groupLeaderID = this.self.groupLeaderID;
        if (!groupLeaderID) {
            throw Error('ICT Phase results not passed');
        }

        if (origin !== groupLeaderID) {
            console.log(`Ignore shared secret from ${origin}`);
            return;
        }

        if (!this.groupMemberMap) {
            throw new Error('GroupMemberMap undefined. Initialize first');
        }

        const groupLeader = await this.groupMemberMap.get(groupLeaderID);

        if (!groupLeader) {
            throw new Error('Missing Group Leader');
        }
        const DHSecret = groupLeader.negotiatedDHSecret;
        if (!DHSecret) {
            throw new Error(
                `Missing DH Secret for groupLeader ${groupLeaderID}`
            );
        }

        const sharedSecret = await verifySharedSecretJWT(
            DHSecret,
            sharedSecretJWT
        );

        this.sharedSecret = sharedSecret;
        this.startSFUMessage();
    }
}

async function hasEveryMemberDHSecret<ID>(
    groupMemberMap: MutexMap<ID, SecretExchangePhaseGroupMember>
) {
    for (const [, member] of await groupMemberMap.exportToMap()) {
        if (!member.negotiatedDHSecret) {
            return false;
        }
    }
    return true;
}
