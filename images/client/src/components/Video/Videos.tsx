import { useState } from 'react';
import useLocalMedia from '../../hooks/useLocalMedia';
import useRTCPeer from '../../hooks/useRTCPeer';
import { BroadcastWrapper } from '../../wrappers/BroadcastChannel';
import VideosDisplay from './VideosDisplay';

export default function Videos() {
    // P2P Calls + Friends List
    // https://reactrouter.com/en/main/start/tutorial
    // Display as Sidebar
    // P2P Calls: Form with Text Input with value UserId + Submit Button --> Action to /p2p/

    //loader --> FriendsList: List of *fetched* friends + Call Button  + (fetched Online Status)

    // Conference Call

    // Display Centered
    // Form : ConferenceName + Submit Button --> Action to /conference

    // Call Options
    // https://web.dev/building-a-settings-component/
    // Display as Modal
    // Activate Modal by pressing options on button on the top right

    //Options:  Show Video on Start, Activate Microphon on Start

    // Local Video
    // TODO Give user Option what should be streamed
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
        // TODO: Add ability to handle stream=null
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
