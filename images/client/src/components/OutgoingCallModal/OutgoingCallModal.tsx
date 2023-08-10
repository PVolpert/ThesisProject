import OutgoingCallLoadbar from './OutgoingCallLoadBar';
import ConfirmCall from './OutgoingCallSteps/ConfirmCall';
import ShowSetupSteps from './OutgoingCallSteps/ShowSetupSteps';
import ConfirmCallee from './OutgoingCallSteps/ConfirmCallee';
import Modal from '../UI/Modal';
import { useStore } from '../../store/Store';
import { useNavigate } from 'react-router-dom';

interface OutgoingCallModalProps {}

export default function OutgoingCallModal({}: OutgoingCallModalProps) {
    const stage = useStore((state) => state.outgoingCallModalStage);
    const setOutgoingCallModalStage = useStore(
        (state) => state.setOutgoingCallModalStage
    );
    const hideModal = useStore((state) => state.hideOutgoingCallModal);
    const resetRTCConnectionSlice = useStore(
        (state) => state.resetRTCConnectionSlice
    );
    const navigate = useNavigate();

    return (
        <Modal onHideModal={hideModal}>
            <div className="flex flex-col p-4 space-y-2">
                <div className="flex-1 md:flex hidden">
                    <OutgoingCallLoadbar stage={stage} />
                </div>
                {stage == 0 && (
                    <ConfirmCall
                        onClickNo={() => {
                            hideModal();
                            resetRTCConnectionSlice();
                        }}
                        onClickYes={() => {
                            setOutgoingCallModalStage(1);
                            navigate('/call/p2p');
                        }}
                    />
                )}
                {stage == 1 && (
                    <ShowSetupSteps
                        onClickNo={() => {
                            hideModal();
                            navigate('/call');
                        }}
                    />
                )}
                {stage == 2 && <ConfirmCallee />}
            </div>
        </Modal>
    );
}
