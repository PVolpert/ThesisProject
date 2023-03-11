import { useLocalMedia } from '../../../hooks/useLocalMedia';
import { useRTCPeer } from '../../../hooks/useRTCPeer';
import classes from './VideoControl.module.css';
import VideoControlButton from './VideoControlButton';

interface VideoControlProps extends useLocalMedia, useRTCPeer {}

export default function VideoControl({
    isLocalStreamActive,
    enableMediaHandler: enableVideoHandler,
    disableMediaHandler: disableVideoHandler,
    isRTCActive,
    startCallHandler,
    stopCallHandler,
}: VideoControlProps) {
    return (
        <div className={classes['video_control']}>
            {!isLocalStreamActive && (
                <VideoControlButton
                    className={classes['show_cam_btn']}
                    onClick={enableVideoHandler}
                >
                    Show Camera
                </VideoControlButton>
            )}
            {isLocalStreamActive && (
                <VideoControlButton
                    className={classes['stop_cam_btn']}
                    onClick={disableVideoHandler}
                >
                    Stop Camera
                </VideoControlButton>
            )}

            {isLocalStreamActive && !isRTCActive && (
                <VideoControlButton
                    className={classes['call_btn']}
                    onClick={startCallHandler}
                >
                    Call
                </VideoControlButton>
            )}
            {isLocalStreamActive && isRTCActive && (
                <VideoControlButton
                    className={classes['hang_up_btn']}
                    onClick={stopCallHandler}
                >
                    Hang Up
                </VideoControlButton>
            )}
        </div>
    );
}
