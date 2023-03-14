import { useState } from 'react';
import useLocalMedia from '../../hooks/useLocalMedia';
import useRTCPeer from '../../hooks/useRTCPeer';
import { BroadcastWrapper } from '../../wrappers/BroadcastChannel';
import VideosDisplay from './VideosDisplay';

export default function Videos() {
    const mediaConstraints: MediaStreamConstraints = {
        video: true,
    };
    const localVideo = useLocalMedia({ constraints: mediaConstraints });

    // Signaling Abstraction
    const broadCastWrapper = new BroadcastWrapper('webrtc');

    // Remote Stream Handling
    const [remoteStreams, setRemoteStreams] = useState<readonly MediaStream[]>(
        []
    );

    function onRemoteTrackHandler({ streams }: RTCTrackEvent) {
        setRemoteStreams(streams);
    }

    // ? Add Support for TURN and STUN here
    const configuration = {};
    const rtcPeer = useRTCPeer({
        configuration,
        stream: localVideo.stream as MediaStream,
        signaling: broadCastWrapper,
        onRemoteTrackHandler,
    });

    // Controls
    return (
        <VideosDisplay
            localVideo={localVideo}
            rtcPeer={rtcPeer}
            remoteStreams={remoteStreams}
        />
    );
}
