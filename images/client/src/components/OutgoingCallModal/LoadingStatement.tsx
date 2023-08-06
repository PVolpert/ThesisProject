import { ReactNode } from 'react';
import LoadStateIcon, { loadState } from '../UI/LoadStateIcon';

interface LoadingStatementProps {
    children?: ReactNode;
    className?: string;
    loadState: loadState;
    loadStatement: string;
}

export default function LoadingStatement({
    children,
    className = '',
    loadState,
    loadStatement,
}: LoadingStatementProps) {
    return (
        <div className="flex space-x-4">
            <p> {loadStatement} </p>
            {/* Loading Animation or Checked */}
            <LoadStateIcon loadState={loadState} />
        </div>
    );
}
