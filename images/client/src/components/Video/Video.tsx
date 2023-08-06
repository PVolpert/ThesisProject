import { ReactNode, forwardRef } from 'react';

interface VideoProps {
    children?: ReactNode;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(function Video(
    { children }: VideoProps,
    ref
) {
    return (
        <video ref={ref} className="" autoPlay>
            {children}
        </video>
    );
});

export default Video;
