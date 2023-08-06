import { useStore } from '../../store/Store';
import CallSettingsDisplay from './CallSettingsDisplay';

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

interface CallSettingsProps {
    className?: string;
}

export interface CallSettings {
    video: boolean;
    audio: boolean;
}

export default function CallSettings({}: CallSettingsProps) {
    const callSettings: CallSettings = useStore((state) => state.callSettings);
    const updateCallSettings = useStore((state) => state.updateCallSettings);

    const changeVideoCheckBoxHandler = checkBoxHandlerBuilder('video');
    const changeAudioCheckBoxHandler = checkBoxHandlerBuilder('audio');

    function checkBoxHandlerBuilder(mediaType: 'video' | 'audio') {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            let newCallOptions: CallSettings = { ...callSettings };
            newCallOptions[mediaType] = event.target.checked;
            updateCallSettings(newCallOptions);
        };
    }

    return (
        <CallSettingsDisplay
            checkBoxState={{
                isAudioChecked: !!callSettings.audio,
                isVideoChecked: !!callSettings.video,
                changeAudioCheckBoxHandler,
                changeVideoCheckBoxHandler,
            }}
        />
    );
}
