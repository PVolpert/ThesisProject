import { Description, MainTitle } from '../../UI/Headers';
import { ictProviders } from '../../../helpers/Auth/OIDCProviderInfo';
import { TokenSet } from '../../../store/slices/ICTAccessTokenSlice';
import {
    ICTProviderInfo,
    convertToICTProvider,
} from '../../../helpers/ICTPhase/OpenIDProvider';
import { useState } from 'react';
import { Candidate } from '../../../helpers/ICTPhase/ICTPhase';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import ProviderSelection from '../elems/ProviderSelection';
import OPNSelection from '../elems/OPNSelection';
import { createTokenSetList } from '../../../helpers/ICTPhase/EventHandlers';
import NoAndYesButtons from '../../UI/NoAndYesButtons';

interface CallerICTSelectionProps {
    candidates: Map<string, Candidate>;
    onYesHandlerCallerICTSelection: (
        trustedOIDCProviders: ICTProviderInfo[],
        getICTParameters: {
            openIDProviderInfo: ICTProviderInfo;
            tokenSet: TokenSet;
            targets: string[];
        }[]
    ) => void;
    onNoHandler: () => void;
}

export default function CallerICTSelection({
    candidates,
    onYesHandlerCallerICTSelection,
    onNoHandler,
}: CallerICTSelectionProps) {
    const [selectedProviders, setSelectedProviders] = useState<
        Map<string, OIDCProvider>
    >(new Map());

    const [matchedTokenSet, setMatchedTokenSet] = useState<
        Map<string, TokenSet>
    >(new Map());

    const [checkedOPNCount, setCheckedOPNCount] = useState(0);

    const [isOPNCheckedMap, setIsOPNCheckedMap] = useState<
        Map<string, boolean>
    >(new Map());

    function onYesHandler() {
        const trustedProviders = ictProviders
            .filter(
                (ictProvider) =>
                    isOPNCheckedMap.get(ictProvider.info.name) === true
            )
            .map(convertToICTProvider);
        onYesHandlerCallerICTSelection(
            trustedProviders,
            createTokenSetList(selectedProviders, matchedTokenSet)
        );
    }

    return (
        <div className="flex flex-col space-y-4 mx-3">
            <MainTitle>Acquire ICT</MainTitle>
            <ProviderSelection
                candidates={candidates}
                setSelectedProviders={setSelectedProviders}
                matchedTokenSet={matchedTokenSet}
                setMatchedTokenSet={setMatchedTokenSet}
            >
                <Description>
                    The conference invitation was accepted by all users. The
                    following OIDC-Providers were chosen as trusted.
                </Description>
            </ProviderSelection>

            <OPNSelection
                setCheckedCount={setCheckedOPNCount}
                isCheckedMap={isOPNCheckedMap}
                setIsCheckedMap={setIsOPNCheckedMap}
            />

            <NoAndYesButtons
                onNoHandler={onNoHandler}
                onYesHandler={onYesHandler}
                NoTitle="Cancel"
                YesTitle="Continue"
                disabledYes={
                    checkedOPNCount <= 0 ||
                    selectedProviders.size !== candidates.size ||
                    selectedProviders.size === 0
                }
            />
        </div>
    );
}
