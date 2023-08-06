import { ReactNode } from 'react';
import { useStore } from '../../store/Store';
import Modal from '../UI/Modal';
import ConfirmCaller from './IncomingCallSteps/ConfirmCaller';
import ShowCallSteps from './IncomingCallSteps/ShowCallSteps';
import IncomingCallLoadbar from './IncomingCallLoadBar';

interface IncomingCallModalProps {
    children?: ReactNode;
    className?: string;
}

export default function IncomingCallModal({}: IncomingCallModalProps) {
    const stage = useStore((state) => state.incomingCallStage);
    const hideModal = useStore((state) => state.hideIncomingCallModal);

    return (
        <Modal onHideModal={hideModal}>
            <div className="flex flex-col space-y-2">
                <div className="flex-1 flex ">
                    <IncomingCallLoadbar stage={stage} />
                </div>
                {stage == 0 && <ConfirmCaller />}
                {stage == 1 && <ShowCallSteps />}
            </div>
        </Modal>
    );
}
