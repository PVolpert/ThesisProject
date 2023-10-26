import { useEffect, useRef } from 'react';
import { SFUPhaseGroupMember } from '../../helpers/SFUPhase/SFUPhase';
import Button from '../UI/Button';
import { Description } from '../UI/Headers';
import RemoteVideo from './RemoteVideo';

interface showStreamsProps {
    encryptedLocalStream: MediaStream | undefined;
    localStream: MediaStream | undefined;
    sfuPhaseMembers: Map<string, SFUPhaseGroupMember>;
}

export default function ShowStreams({
    // encryptedLocalStream,
    localStream,
    sfuPhaseMembers,
}: showStreamsProps) {
    // const [viewEncrypted, setViewEncrypted] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, localVideoRef]);

    useEffect(() => {
        const stopMediaStream = (stream: MediaStream | undefined) => {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach((track) => {
                    track.stop(); // Stop each track in the stream
                });
            }
        };
        return () => stopMediaStream(localStream);
    }, []);

    return (
        <>
            <div className="grid grid-cols-2 gap-2">
                {[...sfuPhaseMembers.values()].map((member) => {
                    return (
                        <RemoteVideo
                            identity={member.identity}
                            remoteStream={member.remoteStream}
                        />
                    );
                })}
            </div>
            <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 flex space-x-2 mb-3">
                <Button
                    // onClick={() => {
                    //     setViewEncrypted((prior) => !prior);
                    // }}
                    className="justify-center flex  bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    Change Mode
                </Button>
            </div>
            <div className="absolute right-0 bottom-0 m-3">
                <video autoPlay width={300} ref={localVideoRef}></video>
                <Description>Yourself</Description>
            </div>
        </>
    );
}
