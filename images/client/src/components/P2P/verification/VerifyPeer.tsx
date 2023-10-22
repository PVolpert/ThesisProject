import { Candidate } from '../../../helpers/ICTPhase/ICTPhase';
import { Description, MainTitle } from '../../UI/Headers';
import AuthenticationSelection from '../elems/AuthenticationSelection';
import { useState } from 'react';
import NoAndYesButtons from '../../UI/NoAndYesButtons';

interface VerifyPeerProps {
    candidates: Map<string, Candidate>;
    onYesHandlerVerifyIdentity: (newAuthenticatedCandidates: string[]) => void;
    onNoHandler: () => void;
}

export default function VerifyPeer({
    candidates,
    onNoHandler,
    onYesHandlerVerifyIdentity: onYesHandlerVerifyPeer,
}: VerifyPeerProps) {
    const [areUserAuthenticated, setAreUserAuthenticated] = useState(false);
    return (
        <div className="flex flex-col space-y-4 mx-3">
            <MainTitle>Authenticate Peers?</MainTitle>
            <AuthenticationSelection
                candidates={candidates}
                setAreUsersAuthenticated={setAreUserAuthenticated}
            >
                <Description>
                    The peers provided the following identity. The identity is
                    verified using OIDC<sup>2</sup>. Please authenticate the
                    users:
                </Description>
            </AuthenticationSelection>
            <NoAndYesButtons
                onNoHandler={onNoHandler}
                onYesHandler={() => {
                    onYesHandlerVerifyPeer([...candidates.keys()]);
                }}
                NoTitle="Cancel"
                YesTitle="Continue"
                disabledYes={!areUserAuthenticated}
            />
        </div>
    );
}
