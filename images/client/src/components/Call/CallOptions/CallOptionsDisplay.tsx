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
    checkBoxState: {
        audioCheckBox: boolean;
        videoCheckBox: boolean;
        changeAudioCheckBoxHandler: (
            e: React.ChangeEvent<HTMLInputElement>
        ) => void;
        changeVideoCheckBoxHandler: (
            e: React.ChangeEvent<HTMLInputElement>
        ) => void;
    };
    submitHandler: (event: React.FormEvent<CallOptions>) => void;
    hideCallOptions: () => void;
}

export default function CallOptionsDisplay({
    checkBoxState,
    submitHandler,
    hideCallOptions,
}: CallOptionsDisplayProps) {
    const {
        audioCheckBox,
        videoCheckBox,
        changeAudioCheckBoxHandler,
        changeVideoCheckBoxHandler,
    } = checkBoxState;

    return (
        <Modal onDismiss={hideCallOptions}>
            <form className={classes['form']} method="dialog">
                <div className={classes['checkbox']}>
                    <label>Audio</label>
                    <input
                        type={'checkbox'}
                        defaultChecked={audioCheckBox}
                        onChange={changeAudioCheckBoxHandler}
                    />
                </div>
                <div className={classes['checkbox']}>
                    <label>Video</label>
                    <input
                        type={'checkbox'}
                        defaultChecked={videoCheckBox}
                        onChange={changeVideoCheckBoxHandler}
                    />
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
