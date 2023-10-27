import { useState } from 'react';
import { Description, MainTitle } from '../../UI/Headers';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import { TokenSet } from '../../../store/slices/ICTAccessTokenSlice';
import { ICTProviderInfo } from '../../../helpers/ICTPhase/OpenIDProvider';
import ProviderSelection from '../elems/ProviderSelection';
import { Candidate } from '../../../helpers/ICTPhase/ICTPhase';
import { createTokenSetList } from '../../../helpers/ICTPhase/EventHandlers';
import AuthenticationSelection from '../elems/AuthenticationSelection';
import NoAndYesButtons from '../../UI/NoAndYesButtons';

interface verifyCallerProps {
    candidates: Map<string, Candidate>;
    onYesHandlerVerifyCaller: (
        oidcProvider: ICTProviderInfo,
        tokenSet: TokenSet,
        target: string
    ) => void;
    onNoHandler: () => void;
}

export default function VerifyCaller({
    candidates,
    onNoHandler,
    onYesHandlerVerifyCaller,
}: verifyCallerProps) {
    const [selectedProviders, setSelectedProviders] = useState<
        Map<string, OIDCProvider>
    >(new Map());

    const [matchedTokenSet, setMatchedTokenSet] = useState<
        Map<string, TokenSet>
    >(new Map());

    const [areUserAuthenticated, setAreUserAuthenticated] = useState(false);
    return (
        <div className="flex flex-col space-y-4 mx-3">
            <MainTitle>Authenticate Caller?</MainTitle>
            <AuthenticationSelection
                candidates={candidates}
                setAreUsersAuthenticated={setAreUserAuthenticated}
            >
                <Description>
                    The caller provided the following identity. The identity is
                    verified using OIDC<sup>2</sup>. Please authenticate the
                    user:
                </Description>
            </AuthenticationSelection>

            <ProviderSelection
                matchedTokenSet={matchedTokenSet}
                setMatchedTokenSet={setMatchedTokenSet}
                setSelectedProviders={setSelectedProviders}
                candidates={candidates}
            >
                <Description>
                    The following OIDC-Providers were chosen as trusted. Please
                    pick one:
                </Description>
            </ProviderSelection>

            <NoAndYesButtons
                onNoHandler={onNoHandler}
                onYesHandler={() => {
                    const [
                        {
                            openIDProviderInfo,
                            tokenSet,
                            targets: [target],
                        },
                    ] = createTokenSetList(selectedProviders, matchedTokenSet);
                    onYesHandlerVerifyCaller(
                        openIDProviderInfo,
                        tokenSet,
                        target
                    );
                }}
                NoTitle="Cancel"
                YesTitle="Continue"
                disabledYes={
                    !areUserAuthenticated &&
                    selectedProviders.size !== candidates.size
                }
            />
        </div>
    );
}
