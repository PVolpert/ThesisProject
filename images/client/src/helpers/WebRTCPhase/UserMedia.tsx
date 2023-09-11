import { CallSettings } from '../../components/Settings/CallSettings';

export async function getUserMedia(callSettings: CallSettings) {
    try {
        if (!callSettings.audio && !callSettings.video) {
            return new MediaStream();
        }

        const newStream = await navigator.mediaDevices.getUserMedia(
            callSettings
        );
        return newStream;
    } catch (error) {
        throw error;
    }
}

// From Signaling and video calling (MDN)
export async function getUserMediaErrorHandler(e: any) {
    switch (e.name) {
        case 'NotFoundError':
            alert(
                'Unable to open your call because no camera and/or microphone' +
                    'were found.'
            );
            break;
        case 'SecurityError':
        case 'PermissionDeniedError':
            // Do nothing; this is the same as the user canceling the call.
            break;
        default:
            alert(`Error opening your camera and/or microphone: ${e.message}`);
            break;
    }
}
