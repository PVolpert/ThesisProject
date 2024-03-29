import { ReactNode } from 'react';

interface OIDCProviderButtonProps {
    onClick: () => void;
    logo: ReactNode;
    text: string;
    isTokenActive?: boolean;
}

export default function OIDCProviderButton({
    onClick,
    logo,
    text,
    isTokenActive = false,
}: OIDCProviderButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={isTokenActive}
            className="flex  items-center justify-center w-full py-2 space-x-3 bg-zinc-100 dark:bg-zinc-600 border border-zinc-500 bg-inherit rounded shadow-sm hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 transition duration-1050"
        >
            <span className="w-6 h-6">{logo}</span>
            <span className="font-thin">{text}</span>
        </button>
    );
}
