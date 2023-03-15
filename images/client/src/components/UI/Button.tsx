//TODO add Button

import { ReactNode } from 'react';

import classes from './Button.module.css';

/**
 * Primary, Secondary, Ternary Style should be selectable
 */

interface ButtonProps {
    children?: ReactNode;
    isSubmit?: true;
    onClick?: () => void;
    style: 'primary' | 'secondary' | 'ternary';
}

export default function Button({
    children,
    onClick,
    style,
    isSubmit,
}: ButtonProps) {
    let type: 'button' | 'submit' = 'button';
    if (isSubmit) {
        type = 'submit';
    }

    let clickHandler = () => console.log('I was clicked');
    if (onClick) {
        clickHandler = onClick;
    }

    return (
        <button
            type={type}
            onClick={clickHandler}
            className={`${classes['button']} ${classes[style]}`}
        >
            {children}
        </button>
    );
}
