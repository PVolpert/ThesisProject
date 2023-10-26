import { useEffect, useRef, useState } from 'react';
import Page from '../components/UI/Page';
// import { Device } from 'mediasoup-client';

export default function TestPage() {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // Function to get the user's media stream
        const getUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
                });
                setLocalStream(stream);
            } catch (error) {
                console.error('Error accessing user media:', error);
            }
        };

        // Call the getUserMedia function when the component mounts
        getUserMedia();

        // Clean up the stream when the component unmounts
        return () => {
            console.log('Cleaning up');
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (videoRef.current && localStream) {
            console.log(localStream.getTracks());
            videoRef.current.srcObject = localStream;
        }
    }, [localStream, videoRef]);

    return (
        <Page>
            <video autoPlay ref={videoRef} />
        </Page>
    );
}
