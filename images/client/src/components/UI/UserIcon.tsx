interface UserIconProps {
    initial: string;
    className?: string;
}

export default function UserIcon({ initial, className = '' }: UserIconProps) {
    return (
        <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xl font-mono ${className}`.trim()}
        >
            {initial.toLocaleUpperCase()}
        </div>
    );
}
