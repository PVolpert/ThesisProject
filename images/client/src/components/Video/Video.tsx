import { forwardRef } from 'react';

import classes from './Video.module.css';

interface VideoProps {}

const Video = forwardRef<HTMLVideoElement>(function Video({}: VideoProps, ref) {
    return <video ref={ref} className={classes['video']} autoPlay></video>;
});

export default Video;
