import { ReactNode } from 'react';
import LoadingStatement from '../../OutgoingCallModal/LoadingStatement';
import Button from '../../UI/Button';
import { useStore } from '../../../store/Store';

interface ShowCallStepsProps {
    onClickYes: () => void;
    onClickNo: () => void;
}

export default function ShowCallSteps({
    onClickYes,
    onClickNo,
}: ShowCallStepsProps) {
    const answerLoadState = useStore((state) => state.answerLoadState);
    const ictAnswerLoadState = useStore((state) => state.ictAnswerLoadState);
    const answerSentLoadState = useStore((state) => state.answerSentLoadState);
    return (
        <>
            <div className="flex flex-col space-y-4">
                <LoadingStatement
                    loadState={answerLoadState}
                    loadStatement="Preparing WebRTC-Answer"
                />
                <LoadingStatement
                    loadState={ictAnswerLoadState}
                    loadStatement="Preparing ICT-Token"
                />
                <LoadingStatement
                    loadState={answerSentLoadState}
                    loadStatement="Sending Call Response"
                />
            </div>
            <div className="flex space-x-4 justify-center">
                <Button
                    onClick={onClickNo}
                    className="bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    Cancel
                </Button>
                <Button
                    onClick={onClickYes}
                    disabled={true}
                    className="bg-springred disabled:bg-inherit disabled:text-springred disabled:cursor-not-allowed  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    Continue
                </Button>
            </div>
        </>
    );
}
