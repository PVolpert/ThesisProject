interface fontProps {
    children: React.ReactNode;
    className?: string;
}

export function MainTitle({ children, className = '' }: fontProps) {
    return (
        <h2
            className={`font-mono text-4xl font-bold text-center ${className}`.trim()}
        >
            {children}
        </h2>
    );
}
export function SubTitle({ children, className = '' }: fontProps) {
    return (
        <h3 className={`font-mono text-2xl font-bold ${className}`.trim()}>
            {children}
        </h3>
    );
}
export function SubSubTitle({ children, className = '' }: fontProps) {
    return (
        <h4 className={`font-mono text-xl font-bold ${className}`.trim()}>
            {children}
        </h4>
    );
}

export function Description({ children, className = '' }: fontProps) {
    return (
        <p className={`max-w-sm font-sans font-light ${className}`.trim()}>
            {children}
        </p>
    );
}
