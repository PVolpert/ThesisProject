import { ReactNode } from 'react';
import Page from '../UI/Page';

interface HomeDisplayProps {
    children?: ReactNode;
    className?: string;
}

export default function HomeDisplay({
    children,
    className = '',
}: HomeDisplayProps) {
    return (
        <Page>
            <div>Here will be the Hero Part</div>
            Secure Authentication and Fast Encrypted Group Unified Audio-Visual
            Real-time Delivery aka SAFEGUARD
            <div>Here we explain how the page works</div>
        </Page>
    );
}
