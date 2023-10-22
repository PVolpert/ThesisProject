import Button from './Button';

interface NoAndYesButtonsProps {
    YesTitle?: string;
    NoTitle?: string;
    onYesHandler: () => void;
    onNoHandler: () => void;
    disabledYes?: boolean;
}

export default function NoAndYesButtons({
    YesTitle = 'Yes',
    NoTitle = 'No',
    onYesHandler,
    onNoHandler,
    disabledYes = false,
}: NoAndYesButtonsProps) {
    return (
        <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4 justify-center md:self-center">
            <Button
                key={'NO'}
                onClick={onNoHandler}
                className="justify-center flex flex-1  bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
            >
                {NoTitle}
            </Button>
            <Button
                key={'Yes'}
                onClick={onYesHandler}
                disabled={disabledYes}
                className="justify-center flex flex-1  bg-springblue hover:bg-inherit disabled:bg-inherit disabled:text-inherit disabled:cursor-not-allowed border-springblue hover:text-springblue text-white transition duration-1050"
            >
                {YesTitle}
            </Button>
        </div>
    );
}
