import { ReactNode } from 'react';

interface PageProps {
    children?: ReactNode;
    className?: string;
}

export default function Page({ children, className = '' }: PageProps) {
    return (
        <main
            className={`flex-1 container sm:mx-auto md:mx-4 ${className}`.trim()}
        >
            {children}
        </main>
    );
}
