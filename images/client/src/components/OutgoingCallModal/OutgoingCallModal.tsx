import ConfirmCall from './ConfirmCall';
import Modal from '../UI/Modal';
import { useStore } from '../../store/Store';
import { useNavigate } from 'react-router-dom';
import ConfirmConference from './ConfirmConference';

interface OutgoingCallModalProps {}

export default function OutgoingCallModal({}: OutgoingCallModalProps) {
    const candidates = useStore((state) => state.candidates);
    const type = useStore((state) => state.type);

    const hideModal = useStore((state) => state.hideOutgoingCallModal);
    const resetICTPhaseSlice = useStore((state) => state.resetICTPhaseSlice);

    const navigate = useNavigate();

    return (
        <Modal onHideModal={hideModal}>
            {(candidates.length === 0 || !type) && (
                <p>There seems to be an mistake </p>
            )}
            {type === 'call' && (
                <ConfirmCall
                    onClickNo={() => {
                        resetICTPhaseSlice();
                        hideModal();
                    }}
                    onClickYes={() => {
                        navigate('/call/p2p');
                        hideModal();
                    }}
                    callee={candidates[0]}
                />
            )}

            {type === 'conference' && (
                <ConfirmConference
                    onClickNo={() => {
                        resetICTPhaseSlice();
                        hideModal();
                    }}
                    onClickYes={() => {
                        navigate('/call/p2p');
                        hideModal();
                    }}
                    candidates={candidates}
                ></ConfirmConference>
            )}
        </Modal>
    );
}
