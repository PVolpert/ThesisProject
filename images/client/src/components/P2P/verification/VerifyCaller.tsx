import { useState } from 'react';
import { Description, MainTitle } from '../../UI/Headers';
import Button from '../../UI/Button';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import { TokenSet } from '../../../store/slices/ICTAccessTokenSlice';
import { OpenIDProviderInfo } from '../../../helpers/ICTPhase/OpenIDProvider';
import ProviderSelection from '../elems/ProviderSelection';
import { Candidate } from '../../../helpers/ICTPhase/ICTPhase';
import { createTokenSetList } from '../../../helpers/ICTPhase/EventHandlers';
import AuthenticationSelection from '../elems/AuthenticationSelection';

interface verifyCallerProps {
    candidates: Map<string, Candidate>;
    onYesHandlerVerifyCaller: (
        oidcProvider: OpenIDProviderInfo,
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

            <div className="flex flex-col  md:flex-row md:space-x-4 md:space-y-0 space-y-4 justify-center md:self-center">
                <Button
                    onClick={onNoHandler}
                    className="justify-center flex flex-1  bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        const [
                            {
                                openIDProviderInfo,
                                tokenSet,
                                targets: [target],
                            },
                        ] = createTokenSetList(
                            selectedProviders,
                            matchedTokenSet
                        );

                        onYesHandlerVerifyCaller(
                            openIDProviderInfo,
                            tokenSet,
                            target
                        );
                    }}
                    disabled={
                        areUserAuthenticated &&
                        selectedProviders.size === candidates.size
                    }
                    className="justify-center flex flex-1 bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
