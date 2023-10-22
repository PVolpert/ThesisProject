import { Candidate } from '../../../helpers/ICTPhase/ICTPhase';
import { Description, MainTitle } from '../../UI/Headers';
import AuthenticationSelection from '../elems/AuthenticationSelection';
import { useState } from 'react';
import NoAndYesButtons from '../../UI/NoAndYesButtons';

interface VerifyCalleeProps {
    candidates: Map<string, Candidate>;
    onYesHandlerVerifyCallee: (newAuthenticatedCandidates: string[]) => void;
    onNoHandler: () => void;
}

export default function VerifyCallee({
    candidates,
    onNoHandler,
    onYesHandlerVerifyCallee,
}: VerifyCalleeProps) {
    const [areUserAuthenticated, setAreUserAuthenticated] = useState(false);
    return (
        <div className="flex flex-col space-y-4 mx-3">
            <MainTitle>Authenticate Caller?</MainTitle>
            <AuthenticationSelection
                candidates={candidates}
                setAreUsersAuthenticated={setAreUserAuthenticated}
            >
                <Description>
                    The callee provided the following identity. The identity is
                    verified using OIDC<sup>2</sup>. Please authenticate the
                    user:
                </Description>
            </AuthenticationSelection>
            <NoAndYesButtons
                onNoHandler={onNoHandler}
                onYesHandler={() => {
                    onYesHandlerVerifyCallee([...candidates.keys()]);
                }}
                NoTitle="Cancel"
                YesTitle="Continue"
                disabledYes={!areUserAuthenticated}
            />
        </div>
    );
}
