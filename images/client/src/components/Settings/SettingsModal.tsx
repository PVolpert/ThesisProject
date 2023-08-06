//(optional) Build gui for call options

import { useStore } from '../../store/Store';
import CloseButton from '../UI/CloseButton';
import { MainTitle } from '../UI/Headers';
import Modal from '../UI/Modal';
import CallSettings from './CallSettings';

/**
 * Template is https://wweb.dev/building-a-settings-component/
 * Display as a Modal
 * Form with following options:
 *  - Video Checkbox
 *  - Microphone Checkbox
 *  - Save Button
 * Takes in setIsShowCallOptions and passes it to the Modal
 *
 * Bonus:
 *  - Receive Setting for checkboxes and handle them
 */
interface SettingsModalProps {}

export default function SettingsModal({}: SettingsModalProps) {
    const hideModal = useStore((state) => state.hideSettingsModal);

    return (
        <Modal onHideModal={hideModal}>
            <CloseButton onClickHandler={hideModal} />
            <div className="grid gap-4 md:gap-12 place-content-center p-6 md:p-20">
                <MainTitle>Settings</MainTitle>
                <form
                    className="grid gap-x-12 gap-y-6 grid-cols-1 md:grid-cols-autofit place-content-center max-w-2xl"
                    method="dialog"
                >
                    {/* Here all setting sections are placed */}
                    <CallSettings />
                </form>
            </div>
        </Modal>
    );
}
