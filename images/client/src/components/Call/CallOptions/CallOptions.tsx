import { useState } from 'react';
import { useZustandStore } from '../../../stores/zustand/ZustandStore';
import CallOptionsDisplay from './CallOptionsDisplay';

/**
 * User can set if microphone/video should be enabled during
 * Target of change is the mediaStreamConstrains state
 * Input is a Form with Checkbox for Video and Audio
 * Method is invoking zustand change on submission
 * Takes in setisShowCallOptions and passes it to Display
 *
 * Bonus:
 * - Check currently true boxes beforehand and pass to Display
 * - Store changes to remote
 */

interface CallOptionsProps {
    hideCallOptions: () => void;
}

export interface CallOptions {
    video?: true;
    audio?: true;
}

export default function CallOptions({ hideCallOptions }: CallOptionsProps) {
    const callOptions = useZustandStore((state) => state.callOptions);
    const updateCallOptions = useZustandStore(
        (state) => state.updateCallOptions
    );

    const [audioCheckBox, setAudioCheckBox] = useState(!!callOptions.audio);

    const [videoCheckBox, setVideoCheckBox] = useState(!!callOptions.video);

    function submitHandler(event: React.FormEvent<CallOptions>) {
        event.preventDefault();
        const newCallOptions: CallOptions = {};
        if (audioCheckBox) {
            newCallOptions.audio = true;
        }
        if (videoCheckBox) {
            newCallOptions.video = true;
        }
        updateCallOptions(newCallOptions);
        hideCallOptions();
    }

    function changeAudioCheckBoxHandler(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setAudioCheckBox(event.target.checked);
    }
    function changeVideoCheckBoxHandler(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        setVideoCheckBox(event.target.checked);
    }

    return (
        <CallOptionsDisplay
            checkBoxState={{
                audioCheckBox,
                videoCheckBox,
                changeAudioCheckBoxHandler,
                changeVideoCheckBoxHandler,
            }}
            submitHandler={submitHandler}
            hideCallOptions={hideCallOptions}
        />
    );
}
