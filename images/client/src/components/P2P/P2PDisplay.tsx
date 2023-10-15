import { useMemo } from 'react';
import { ictDisplayPhases } from '../../pages/P2P';
import Page from '../UI/Page';
import CallerICTSelection from './verification/CallerICTSelection';
import VerifyCaller from './verification/VerifyCaller';
import { OpenIDProviderInfo } from '../../helpers/ICTPhase/OpenIDProvider';
import { TokenSet } from '../../store/slices/ICTAccessTokenSlice';
import { Candidate } from '../../helpers/ICTPhase/ICTPhase';

export interface handlerProps {
    onYesHandler: () => void;
}
interface P2PDisplayProps {
    localRef: React.RefObject<HTMLVideoElement>;
    remoteRef: React.RefObject<HTMLVideoElement>;
    ictDisplayPhase: ictDisplayPhases;
    onYesHandlerCallerICTSelection: (
        trustedOIDCProviders: OpenIDProviderInfo[],
        getICTParameters: {
            openIDProviderInfo: OpenIDProviderInfo;
            tokenSet: TokenSet;
            targets: string[];
        }[]
    ) => void;
    onYesHandlerVerifyCaller: (
        oidcProvider: OpenIDProviderInfo,
        tokenSet: TokenSet,
        target: string
    ) => void;
    onNoHandler: () => void;
    verifyOPNCandidates: Map<string, Candidate>;
    verifyCalleeIdentityCandidates: Map<string, Candidate>;
    verifyCallerIdentityAndCreateICTAnswerCandidates: Map<string, Candidate>;
}

export default function P2PDisplay({
    ictDisplayPhase,
    onNoHandler,
    onYesHandlerCallerICTSelection,
    verifyOPNCandidates,
    verifyCallerIdentityAndCreateICTAnswerCandidates,
    onYesHandlerVerifyCaller,
}: P2PDisplayProps) {
    const display = useMemo(() => {
        switch (ictDisplayPhase) {
            //TODO Waits on low time days
            case 'waitForICTOffer':
                return <></>;
            case 'waitForCallAnswer':
                return <></>;
            case 'waitForICTAnswer':
                return <></>;

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
                return <></>;
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
        }
    }, [ictDisplayPhase]);

    return <Page className="">{display}</Page>;
}
