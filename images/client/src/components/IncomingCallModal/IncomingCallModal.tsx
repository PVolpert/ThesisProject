import { ReactNode } from 'react';
import { useStore } from '../../store/Store';
import Modal from '../UI/Modal';
import ConfirmCaller from './IncomingCallSteps/ConfirmCaller';
import ShowCallSteps from './IncomingCallSteps/ShowCallSteps';
import IncomingCallLoadbar from './IncomingCallLoadBar';
import { useNavigate } from 'react-router-dom';

interface IncomingCallModalProps {
    children?: ReactNode;
    className?: string;
}

export default function IncomingCallModal({}: IncomingCallModalProps) {
    const stage = useStore((state) => state.incomingCallStage);

    const hideModal = useStore((state) => state.hideIncomingCallModal);
    const setIncomingCallModalStage = useStore(
        (state) => state.setIncomingCallModalStage
    );
    const navigate = useNavigate();

    return (
        <Modal onHideModal={hideModal}>
            <div className="flex flex-col p-4 space-y-2">
                <div className="flex-1 flex ">
                    <IncomingCallLoadbar stage={stage} />
                </div>
                {stage == 0 && (
                    <ConfirmCaller
                        onClickYes={() => {
                            setIncomingCallModalStage(1);
                            navigate('/call/p2p');
                        }}
                        onClickNo={() => {}}
                    />
                )}
                {stage == 1 && (
                    <ShowCallSteps
                        onClickYes={() => {
                            hideModal();
                        }}
                        onClickNo={() => {
                            hideModal();
                            navigate('/call/');
                        }}
                    />
                )}
            </div>
        </Modal>
    );
}
