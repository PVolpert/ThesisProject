import { useEffect, useState } from 'react';
import { useZustandStore } from '../stores/zustand/ZustandStore';
import { useToken } from './useToken';

export default function useLocalStream() {
    const { accessToken } = useToken({ needsToken: true });
    const [localStream, setLocalStream] = useState(new MediaStream());
    const constraints = useZustandStore((state) => state.callOptions);

    async function loadUsermedia() {
        const newStream = await navigator.mediaDevices.getUserMedia(
            constraints
        );
        setLocalStream(newStream);
    }

    // ? Rewrite in a more concise way without using flag
    function removeVideoTrack() {
        const newStream = localStream.clone();
        newStream.getVideoTracks().forEach((track) => {
            track.stop();
            newStream.removeTrack(track);
        });
        setLocalStream(newStream);
    }
    function removeAudioTrack() {
        const newStream = localStream.clone();
        newStream.getAudioTracks().forEach((track) => {
            track.stop();
            newStream.removeTrack(track);
        });
        setLocalStream(newStream);
    }

    useEffect(() => {
        if (!accessToken) {
            return;
        }
        if (!constraints.audio && localStream.getAudioTracks().length !== 0) {
            removeAudioTrack();
            return;
        }
        if (!constraints.video && localStream.getVideoTracks().length !== 0) {
            removeVideoTrack();
            return;
        }
        if (
            (constraints.video && localStream.getVideoTracks().length === 0) ||
            (constraints.audio && localStream.getAudioTracks().length === 0)
        ) {
            loadUsermedia();
            return;
        }
    }, [constraints]);

    return localStream;
}
