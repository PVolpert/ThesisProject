import { ReactNode } from 'react';

/**
 * Primary, Secondary, Ternary Style should be selectable
 */

interface ButtonProps {
    children?: ReactNode;
    className?: string;
    type?: 'submit' | 'reset' | 'button';
    onClick?: (() => void) | ((event: React.FormEvent<any>) => void);
    disabled?: boolean;
}

export default function Button({
    children,
    className = '',
    type = 'button',
    onClick = () => {
        console.log('I am a placeholder click handler');
    },
    disabled = false,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`flex place-items-center border-2 rounded-lg px-8 py-2 shadow-md ${className}`.trim()}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
