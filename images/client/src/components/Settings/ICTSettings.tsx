import { ReactNode } from 'react';

interface ICTSettingsProps {
    children?: ReactNode;
    className?: string;
}

// TODO Implement options for allowing or disallowing ict from call partner
export default function ICTSettings({
    children,
    className = '',
}: ICTSettingsProps) {}
