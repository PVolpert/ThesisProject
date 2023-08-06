import Page from '../UI/Page';
import Video from '../Video/Video';

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
    return (
        <Page className="flex flex-1">
            <div className="relative z-0 container  mx-auto md:mb-2 bg-black ">
                <Video ref={remoteRef}>
                    <p>No source</p>
                </Video>
                <div className="absolute w-1/6 h-1/6 bottom-0 right-0 bg-red-800">
                    <Video ref={localRef} />
                </div>
                <div className="absolute bottom-0 left-1/2 z-1 w-6 h-6 block hover:hidden bg-white" />
            </div>
        </Page>
    );
}
