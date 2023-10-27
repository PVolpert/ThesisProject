import { useEffect, useRef } from 'react';
import { Description } from '../UI/Headers';
import { Identity } from '../../helpers/ICTPhase/ICTPhase';

interface RemoteVideoProps {
    remoteStream: MediaStream | undefined;
    identity: Identity;
}

export default function RemoteVideo({
    remoteStream,
    identity,
}: RemoteVideoProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const stopMediaStream = (stream: MediaStream | undefined) => {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach((track) => {
                    track.stop(); // Stop each track in the stream
                });
            }
        };
        return () => stopMediaStream(remoteStream);
    }, []);

    useEffect(() => {
        if (remoteStream && videoRef.current) {
            videoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, videoRef]);

    return (
        <div>
            <video autoPlay ref={videoRef}></video>
            <Description>
                {`${identity.name} (${identity.issName})`}
            </Description>
        </div>
    );
}
