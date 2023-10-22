import { ReactNode, useMemo, useState } from 'react';
import { useStore } from '../../store/Store';
import Modal from '../UI/Modal';
import ConfirmIncoming from './ConfirmIncoming';
import { useNavigate } from 'react-router-dom';

import { ictProviders } from '../../helpers/Auth/OIDCProviderInfo';
import { Description, MainTitle } from '../UI/Headers';

interface IncomingCallModalProps {
    children?: ReactNode;
    className?: string;
}

export default function IncomingCallModal({}: IncomingCallModalProps) {
    const caller = useStore((state) => state.caller);
    const type = useStore((state) => state.type);
    const hideModal = useStore((state) => state.hideIncomingCallModal);
    const setTrustedOpenIDProviders = useStore(
        (state) => state.setTrustedOpenIDProviders
    );
    const navigate = useNavigate();

    const callerUserName = useMemo(() => {
        if (!caller) {
            return;
        }
        return caller.username;
    }, [caller]);

    const [checkedOPNCount, setCheckedOPNCount] = useState(0);

    const [isOPNCheckedMap, setIsOPNCheckedMap] = useState<
        Map<string, boolean>
    >(new Map());

    function onYesHandler() {
        const trustedProviders = ictProviders.filter(
            (ictProvider) => isOPNCheckedMap.get(ictProvider.info.name) === true
        );
        setTrustedOpenIDProviders(trustedProviders);
        hideModal();
        navigate('/call/p2p');
    }

    function onNoHandler() {
        hideModal();
    }

    return (
        <Modal onHideModal={hideModal}>
            <ConfirmIncoming
                username={callerUserName || 'unknown'}
                checkedOPNCount={checkedOPNCount}
                isOPNCheckedMap={isOPNCheckedMap}
                setCheckedCount={setCheckedOPNCount}
                setIsCheckedMap={setIsOPNCheckedMap}
                onYesHandler={onYesHandler}
                onNoHandler={onNoHandler}
            >
                {caller && type === 'call' && (
                    <>
                        <MainTitle> Accept Call? </MainTitle>
                        <Description>
                            You are getting called by{' '}
                            {callerUserName || 'unknown'}. Do you want to accept
                            the call? The caller has the following
                            identifications.
                        </Description>
                    </>
                )}
                {caller && type === 'conference' && (
                    <>
                        <MainTitle> Join Conference? </MainTitle>
                        <Description>
                            You are invited to a conference by{' '}
                            {callerUserName || 'unknown'}. Continue with
                            conference establishment?
                        </Description>
                    </>
                )}
            </ConfirmIncoming>
        </Modal>
    );
}
