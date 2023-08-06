import { ReactNode } from 'react';
import LoadingStatement from '../../OutgoingCallModal/LoadingStatement';
import Button from '../../UI/Button';

interface ShowCallStepsProps {
    children?: ReactNode;
    className?: string;
}

export default function ShowCallSteps({
    children,
    className = '',
}: ShowCallStepsProps) {
    return (
        <>
            <div className="flex flex-col space-y-4">
                <LoadingStatement
                    loadState="done"
                    loadStatement="Requesting ICT Tokens"
                />
                <LoadingStatement
                    loadState="failed"
                    loadStatement="Logging ICT Tokens"
                />
                <LoadingStatement
                    loadState="loading"
                    loadStatement="Sending Call Response"
                />
                <LoadingStatement
                    loadState="loading"
                    loadStatement="Waiting for Caller"
                />
            </div>
            <div className="flex space-x-4 justify-center">
                <Button
                    onClick={() => {}}
                    className="bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {}}
                    disabled={true}
                    className="bg-springred disabled:bg-inherit disabled:text-springred disabled:cursor-not-allowed  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    Continue
                </Button>
            </div>
        </>
    );
}
