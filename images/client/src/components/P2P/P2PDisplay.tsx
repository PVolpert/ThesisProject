import { ictDisplayPhases } from '../../pages/P2P';
import Page from '../UI/Page';
import CallerICTSelection from './verification/CallerICTSelection';
import VerifyCaller from './verification/VerifyCaller';
import { ICTProviderInfo } from '../../helpers/ICTPhase/OpenIDProvider';
import { TokenSet } from '../../store/slices/ICTAccessTokenSlice';
import { Candidate } from '../../helpers/ICTPhase/ICTPhase';
import VerifyCallee from './verification/VerifyCallee';
import PeerICTSelection from './verification/PeerICTSelection';
import VerifyPeer from './verification/VerifyPeer';
import {
    WaitForCallAnswer,
    WaitForCandidates,
    WaitForConfirmations,
    WaitForConnectionStart,
    WaitForICTAnswer,
    WaitForICTOffer,
    WaitForKeyExchange,
    WaitForOtherPeers,
    WaitForPeerICTTransfer,
    WaitForPeerOPN,
} from './Wait';
import { SFUPhaseGroupMember } from '../../helpers/SFUPhase/SFUPhase';
import ShowStreams from './ShowStreams';

export interface handlerProps {
    onYesHandler: () => void;
}
interface P2PDisplayProps {
    localRef: React.RefObject<HTMLVideoElement>;
    remoteRef: React.RefObject<HTMLVideoElement>;
    ictDisplayPhase: ictDisplayPhases;
    onYesHandlerCallerICTSelection: (
        trustedOIDCProviders: ICTProviderInfo[],
        getICTParameters: {
            openIDProviderInfo: ICTProviderInfo;
            tokenSet: TokenSet;
            targets: string[];
        }[]
    ) => Promise<void>;
    onYesHandlerVerifyCaller: (
        oidcProvider: ICTProviderInfo,
        tokenSet: TokenSet,
        target: string
    ) => Promise<void>;
    onYesHandlerVerifyCallee: (
        newAuthenticatedCandidates: string[]
    ) => Promise<void>;
    onYesHandlerVerifyPeerOPN: (
        getICTParameters: {
            openIDProviderInfo: ICTProviderInfo;
            tokenSet: TokenSet;
            targets: string[];
        }[]
    ) => Promise<void>;
    onYesHandlerVerifyPeerIdentity: (
        newAuthenticatedCandidates: string[]
    ) => Promise<void>;
    onNoHandler: () => void;
    verifyOPNCandidates: Map<string, Candidate>;
    verifyCalleeIdentityCandidates: Map<string, Candidate>;
    verifyCallerIdentityAndCreateICTAnswerCandidates: Map<string, Candidate>;
    verifyPeerOPNCandidates: Map<string, Candidate>;
    verifyPeerIdentityCandidates: Map<string, Candidate>;
    sfuPhaseMembers: Map<string, SFUPhaseGroupMember>;
    localStream: MediaStream | undefined;
    encryptedLocalStream: MediaStream | undefined;
}

export default function P2PDisplay({
    ictDisplayPhase,
    onNoHandler,
    onYesHandlerCallerICTSelection,
    onYesHandlerVerifyCaller,
    onYesHandlerVerifyCallee,
    onYesHandlerVerifyPeerIdentity,
    onYesHandlerVerifyPeerOPN,
    verifyOPNCandidates,
    verifyCallerIdentityAndCreateICTAnswerCandidates,
    verifyCalleeIdentityCandidates,
    verifyPeerOPNCandidates,
    verifyPeerIdentityCandidates,
    sfuPhaseMembers,
    localStream,
    encryptedLocalStream,
}: P2PDisplayProps) {
    const display = (() => {
        switch (ictDisplayPhase) {
            case 'waitForICTOffer':
                return <WaitForICTOffer />;
            case 'waitForCallAnswer':
                return <WaitForCallAnswer />;
            case 'waitForICTAnswer':
                return <WaitForICTAnswer />;
            case 'waitForConnectionStart':
                return <WaitForConnectionStart />;
            case 'waitForCandidates':
                return <WaitForCandidates />;
            case 'waitForPeerOPN':
                return <WaitForPeerOPN />;
            case 'waitForPeerICTTransfer':
                return <WaitForPeerICTTransfer />;
            case 'waitForConfirmations':
                return <WaitForConfirmations />;
            case 'waitForOtherPeers':
                return <WaitForOtherPeers />;
            case 'waitForKeyExchange':
                return <WaitForKeyExchange />;
            case 'verifyOPNAndCreateICTOffer':
                return (
                    <CallerICTSelection
                        {...{
                            onNoHandler,
                            onYesHandlerCallerICTSelection:
                                onYesHandlerCallerICTSelection,
                            candidates: verifyOPNCandidates,
                        }}
                    ></CallerICTSelection>
                );
            case 'verifyCalleeIdentity':
                return (
                    <VerifyCallee
                        candidates={verifyCalleeIdentityCandidates}
                        onNoHandler={onNoHandler}
                        onYesHandlerVerifyCallee={onYesHandlerVerifyCallee}
                    ></VerifyCallee>
                );
            case 'verifyCallerIdentityAndCreateICTAnswer':
                return (
                    <VerifyCaller
                        onNoHandler={onNoHandler}
                        onYesHandlerVerifyCaller={onYesHandlerVerifyCaller}
                        candidates={
                            verifyCallerIdentityAndCreateICTAnswerCandidates
                        }
                    />
                );
            case 'verifyPeerOPN':
                return (
                    <PeerICTSelection
                        onNoHandler={onNoHandler}
                        onYesHandlerVerifyPeerOPN={onYesHandlerVerifyPeerOPN}
                        candidates={verifyPeerOPNCandidates}
                    />
                );
            case 'verifyPeerIdentity':
                return (
                    <VerifyPeer
                        onNoHandler={onNoHandler}
                        onYesHandlerVerifyIdentity={
                            onYesHandlerVerifyPeerIdentity
                        }
                        candidates={verifyPeerIdentityCandidates}
                    />
                );
            case 'showStreams':
                return (
                    <ShowStreams
                        encryptedLocalStream={encryptedLocalStream}
                        localStream={localStream}
                        sfuPhaseMembers={sfuPhaseMembers}
                    />
                );
        }
    })();

    return <Page className="mx-2">{display}</Page>;
}
