import React from 'react';

interface CardProps {
    className?: string;
    children: React.ReactNode;
}

function Card({ className, children }: CardProps) {
    return (
        <div
            className={`flex flex-col md:flex-row space-y-10 md:space-y-0 bg-zinc-100 dark:bg-zinc-700 border border-zinc-500 shadow-xl rounded-2xl ${className}`}
        >
            {children}
        </div>
    );
}

export default Card;
