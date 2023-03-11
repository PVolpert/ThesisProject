import { ReactNode } from 'react';

import classes from './VideoControlButton.module.css';
interface VideoControlButtonProps {
    children?: ReactNode;
    onClick: () => void;
    className?: string;
}

export default function VideoControlButton({
    onClick,
    className,
    children,
}: VideoControlButtonProps) {
    let parentClasses = '';
    if (className) {
        parentClasses = ' ' + className;
    }
    return (
        <button className={classes.card + parentClasses} onClick={onClick}>
            {children}
        </button>
    );
}
