import { useState } from 'react';
import { Candidate } from '../../../helpers/ICTPhase/ICTPhase';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import { TokenSet } from '../../../store/slices/ICTAccessTokenSlice';
import ProviderSelection from '../elems/ProviderSelection';
import { Description, MainTitle } from '../../UI/Headers';
import NoAndYesButtons from '../../UI/NoAndYesButtons';
import { ICTProviderInfo } from '../../../helpers/ICTPhase/OpenIDProvider';
import { createTokenSetList } from '../../../helpers/ICTPhase/EventHandlers';

interface VerifyPeerProps {
    candidates: Map<string, Candidate>;
    onYesHandlerVerifyPeerOPN: (
        getICTParameters: {
            openIDProviderInfo: ICTProviderInfo;
            tokenSet: TokenSet;
            targets: string[];
        }[]
    ) => void;
    onNoHandler: () => void;
}

export default function VerifyPeer({
    candidates,
    onNoHandler,
    onYesHandlerVerifyPeerOPN: onYesHandlerVerifyPeerIdentity,
}: VerifyPeerProps) {
    const [selectedProviders, setSelectedProviders] = useState<
        Map<string, OIDCProvider>
    >(new Map());

    const [matchedTokenSet, setMatchedTokenSet] = useState<
        Map<string, TokenSet>
    >(new Map());

    function onYesHandler() {
        onYesHandlerVerifyPeerIdentity(
            createTokenSetList(selectedProviders, matchedTokenSet)
        );
    }

    return (
        <div className="flex flex-col space-y-4 mx-3">
            <MainTitle>Acquire ICT for Peers</MainTitle>
            <ProviderSelection
                candidates={candidates}
                setSelectedProviders={setSelectedProviders}
                matchedTokenSet={matchedTokenSet}
                setMatchedTokenSet={setMatchedTokenSet}
            >
                <Description>
                    The other group members have provided the following trusted
                    provider options. Please select a valid one for each member.
                </Description>
            </ProviderSelection>

            <NoAndYesButtons
                onNoHandler={onNoHandler}
                onYesHandler={onYesHandler}
                NoTitle="Cancel"
                YesTitle="Continue"
                disabledYes={selectedProviders.size !== candidates.size}
            />
        </div>
    );
}
