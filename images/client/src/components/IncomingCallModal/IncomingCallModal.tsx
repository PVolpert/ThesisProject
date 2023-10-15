import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useStore } from '../../store/Store';
import Modal from '../UI/Modal';
import ConfirmCaller from './IncomingCallSteps/ConfirmCaller';
import { useNavigate } from 'react-router-dom';
import ConfirmIncomingConference from './IncomingCallSteps/ConfirmIncomingConference';
import { ictProviders } from '../../helpers/Auth/OIDCProviderInfo';
import OIDCProvider from '../../helpers/Auth/OIDCProvider';

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

    const [checkedCount, setCheckedCount] = useState(0);

    const [formData, setFormData] = useState<Map<string, boolean>>(new Map());

    useEffect(() => {
        const formDataMap = new Map(
            ictProviders.map((ictProvider) => [
                `checkbox_${ictProvider.info.name}`,
                false,
            ])
        );

        setFormData(formDataMap);
    }, []);

    // Checkbox Changed function
    const onCheckBoxChangeHandlerBuilder = (ictProvider: OIDCProvider) => {
        const onCheckBoxChangeHandler = () => {
            if (!formData.get(`checkbox_${ictProvider.info.name}`)) {
                const newMap = new Map(formData);
                newMap.set(`checkbox_${ictProvider.info.name}`, true);
                setFormData(newMap);
                setCheckedCount((prior) => {
                    return prior + 1;
                });
                return;
            }
            const newMap = new Map(formData);
            newMap.set(`checkbox_${ictProvider.info.name}`, false);
            setFormData(newMap);
            setCheckedCount((prior) => {
                return prior - 1;
            });
            return;
        };
        return onCheckBoxChangeHandler;
    };

    return (
        <Modal onHideModal={hideModal}>
            {!caller && <p>Something went wrong</p>}

            {caller && type === 'call' && (
                <ConfirmCaller
                    onClickYes={() => {
                        const trustedProviders = ictProviders.filter(
                            (ictProvider) =>
                                formData.get(
                                    `checkbox_${ictProvider.info.name}`
                                ) === true
                        );
                        setTrustedOpenIDProviders(trustedProviders);
                        hideModal();
                        navigate('/call/p2p');
                    }}
                    onClickNo={() => {
                        hideModal();
                    }}
                    onCheckBoxChangeHandlerBuilder={
                        onCheckBoxChangeHandlerBuilder
                    }
                    checkedCount={checkedCount}
                    formData={formData}
                    username={callerUserName || 'unknown'}
                />
            )}
            {caller && type === 'conference' && (
                <ConfirmIncomingConference
                    onClickYes={() => {
                        const trustedProviders = ictProviders.filter(
                            (ictProvider) =>
                                formData.get(
                                    `checkbox_${ictProvider.info.name}`
                                ) === true
                        );
                        setTrustedOpenIDProviders(trustedProviders);
                        hideModal();
                        navigate('/call/conference');
                    }}
                    onClickNo={() => {
                        hideModal();
                    }}
                    onCheckBoxChangeHandlerBuilder={
                        onCheckBoxChangeHandlerBuilder
                    }
                    checkedCount={checkedCount}
                    formData={formData}
                    username={callerUserName || 'unkown'}
                />
            )}
        </Modal>
    );
}
