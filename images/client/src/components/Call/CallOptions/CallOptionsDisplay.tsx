//(optional) Build gui for call options

import Button from '../../UI/Button';
import Modal from '../../UI/Modal';
import { CallOptions } from './CallOptions';
import classes from './CallOptionsDisplay.module.css';

/**
 * Template is https://web.dev/building-a-settings-component/
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
interface CallOptionsDisplayProps {
    options: CallOptions;
    onSetCallOptions: () => void;
    hideCallOptions: () => void;
}

export default function CallOptionsDisplay({
    options,
    onSetCallOptions,
    hideCallOptions,
}: CallOptionsDisplayProps) {
    function submitHandler() {
        onSetCallOptions();
        hideCallOptions();
    }

    return (
        <Modal onDismiss={hideCallOptions}>
            <form className={classes['form']}>
                <div className={classes['checkbox']}>
                    <label>Video</label>
                    <input type={'checkbox'} checked={options.video} />
                </div>
                <div className={classes['checkbox']}>
                    <label>Audio</label>
                    <input type={'checkbox'} checked={options.audio} />
                </div>
                <div className={classes['controls']}>
                    <Button
                        onClick={submitHandler}
                        isSubmit={true}
                        style="primary"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
