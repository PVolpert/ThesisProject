import LoadStateIcon from '../UI/LoadStateIcon';
import { LoadState } from '../../store/slices/OutgoingCallSlice';

interface LoadingStatementProps {
    loadState: LoadState;
    loadStatement: string;
}

export default function LoadingStatement({
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
