import { ReactNode, useEffect } from 'react';

import { useRTCPeer } from '../../hooks/useRTCPeer';
import { useLocalMedia } from '../../hooks/useLocalMedia';
import LocalVideo from './LocalVideo/LocalVideo';
import VideoControl from './VideoControl/VideoControl';
import RemoteVideo from './RemoteVideo/RemoteVideo';
import classes from './VideosDisplay.module.css';

interface VideosDisplayProps {
    rtcPeer: useRTCPeer;
    localVideo: useLocalMedia;
    remoteStreams: readonly MediaStream[];
}

let remoteVideos: ReactNode[] = [];

export default function VideosDisplay({
    rtcPeer,
    localVideo,
    remoteStreams,
}: VideosDisplayProps) {
    if (remoteStreams.length === 0) {
        remoteVideos = [];
    }
    remoteVideos = remoteStreams.map((stream) => {
        return <RemoteVideo id={Math.random().toString()} stream={stream} />;
    });

    return (
        <>
            <LocalVideo videoRef={localVideo.mediaRef} />
            <ul className={classes['a']}>{remoteVideos}</ul>
            <VideoControl {...{ ...rtcPeer, ...localVideo }} />
        </>
    );
}
