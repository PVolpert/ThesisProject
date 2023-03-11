import classes from './LocalVideo.module.css';

interface localVideoProps {
    videoRef: React.RefObject<HTMLVideoElement>;
}

export default function LocalVideo({ videoRef }: localVideoProps) {
    return (
        <video
            className={classes['local-video']}
            ref={videoRef}
            autoPlay
            playsInline
        ></video>
    );
}
