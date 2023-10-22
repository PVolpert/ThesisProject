import { useMemo } from 'react';
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
    WaitForConnectionStart,
    WaitForICTAnswer,
    WaitForICTOffer,
    WaitForPeerICTTransfer,
    WaitForPeerOPN,
} from './Wait';

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
}: P2PDisplayProps) {
    const display = useMemo(() => {
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
        }
    }, [ictDisplayPhase]);

    return <Page className="mx-2">{display}</Page>;
}
