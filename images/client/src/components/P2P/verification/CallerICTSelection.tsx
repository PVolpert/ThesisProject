import Button from '../../UI/Button';
import { Description, MainTitle } from '../../UI/Headers';
import { ictProviders } from '../../../helpers/Auth/OIDCProviderInfo';
import { TokenSet } from '../../../store/slices/ICTAccessTokenSlice';
import {
    OpenIDProviderInfo,
    convertOIDCProvider,
} from '../../../helpers/ICTPhase/OpenIDProvider';
import { useState } from 'react';
import { Candidate } from '../../../helpers/ICTPhase/ICTPhase';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import ProviderSelection from '../elems/ProviderSelection';
import OPNSelection from '../elems/OPNSelection';
import { createTokenSetList } from '../../../helpers/ICTPhase/EventHandlers';

interface CallerICTSelectionProps {
    candidates: Map<string, Candidate>;
    onYesHandlerCallerICTSelection: (
        trustedOIDCProviders: OpenIDProviderInfo[],
        getICTParameters: {
            openIDProviderInfo: OpenIDProviderInfo;
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
                    isOPNCheckedMap.get(`checkbox_${ictProvider.info.name}`) ===
                    true
            )
            .map(convertOIDCProvider);
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

            <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4 justify-center md:self-center">
                <Button
                    onClick={onNoHandler}
                    className="justify-center flex flex-1  bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onYesHandler}
                    disabled={
                        checkedOPNCount <= 0 ||
                        selectedProviders.size !== candidates.size
                    }
                    className="bg-springblue hover:bg-inherit disabled:bg-inherit disabled:text-inherit disabled:cursor-not-allowed border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
