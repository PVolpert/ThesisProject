//TODO (optional) Create CallOptions

import { useStore } from '../../../stores/ZustandStore';
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
    video: boolean;
    audio: boolean;
}

export default function CallOptions({ hideCallOptions }: CallOptionsProps) {
    // ? Acquire this via zustand in the future
    const callOptions = useStore((state) => state.callOptions);
    const onSetCallOptions = useStore((state) => state.reset);
    return (
        <CallOptionsDisplay
            options={callOptions}
            onSetCallOptions={onSetCallOptions}
            hideCallOptions={hideCallOptions}
        />
    );
}
