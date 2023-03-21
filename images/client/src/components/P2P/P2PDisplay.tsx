import Video from '../Video/Video';
import classes from './P2PDisplay.module.css';

/**
 * *Components
 *  - LocalVideo (Bottom Right Corner)
 *  - Remote Video (Whole Page)
 *  - Controls
 *      - Mute
 *      - Video
 *      - Hang Up
 */

interface P2PDisplayProps {
    localRef: React.RefObject<HTMLVideoElement>;
    remoteRef: React.RefObject<HTMLVideoElement>;
}

export default function P2PDisplay({ localRef, remoteRef }: P2PDisplayProps) {
    // TODO acquire local stream store state
    // TODO acquire remote stream store state
    // TODO useEffect that assigns streams when they are loaded
    // TODO Controls for Tracks

    return (
        <>
            <div className={classes['local']}>
                <Video ref={localRef} />
            </div>
            <div className={classes['remote']}>
                <Video ref={remoteRef} />
            </div>
            <div className={classes['controls']}> </div>
        </>
    );
}
