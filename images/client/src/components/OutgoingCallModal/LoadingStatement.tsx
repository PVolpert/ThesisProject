import LoadStateIcon from '../UI/LoadStateIcon';
import { AsyncTaskState } from '../../store/slices/OutgoingCallSlice';

interface LoadingStatementProps {
    loadState: AsyncTaskState;
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
