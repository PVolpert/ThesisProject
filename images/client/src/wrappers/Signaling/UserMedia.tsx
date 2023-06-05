import { CallOptions } from '../../components/Call/CallOptions/CallOptions';

export async function getUserMedia(constraints: CallOptions) {
    try {
        if (!constraints.audio && !constraints.video) {
            return new MediaStream();
        }

        const newStream = await navigator.mediaDevices.getUserMedia(
            constraints
        );
        return newStream;
    } catch (error) {
        getUserMediaErrorHandler(error);
    }
}

export function getUserMediaErrorHandler(e: any) {
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
