import { useRef, useState } from 'react';

export interface useLocalMediaProps {
    constraints: MediaStreamConstraints;
}

export interface useLocalMedia {
    mediaRef: React.RefObject<HTMLVideoElement>;
    isLocalStreamActive: boolean;
    stream: MediaStream | null;
    enableMediaHandler: () => void;
    disableMediaHandler: () => void;
}

let stream: MediaStream | null = null;

export default function useLocalMedia({
    constraints,
}: useLocalMediaProps): useLocalMedia {
    const mediaRef = useRef<HTMLVideoElement>(null);
    const [isStreamActive, setIsStreamActive] = useState(false);

    function enableMediaHandler() {
        if (stream) {
            return;
        }

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(handleSuccess)
            .catch(handleError);

        function handleSuccess(newStream: MediaStream) {
            mediaRef.current!.srcObject = newStream;
            stream = newStream;
            setIsStreamActive(true);
        }

        function handleError(error: Error) {
            console.log('navigator.getUserMedia error: ', error);
        }
    }

    function disableMediaHandler() {
        if (!stream) {
            return;
        }
        stream.getTracks().forEach((track) => track.stop());
        mediaRef.current!.srcObject = null;

        setIsStreamActive(false);
    }

    return {
        mediaRef,
        isLocalStreamActive: isStreamActive,
        stream,
        enableMediaHandler,
        disableMediaHandler,
    };
}
