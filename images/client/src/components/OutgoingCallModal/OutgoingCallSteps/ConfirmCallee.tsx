import { Description, MainTitle } from '../../UI/Headers';
import Button from '../../UI/Button';
import UserBlock from '../../UI/UserBlock';

interface ConfirmCalleeProps {
    onClickYes: () => void;
    onClickNo: () => void;
}

export default function ConfirmCallee({
    onClickYes,
    onClickNo,
}: ConfirmCalleeProps) {
    return (
        <>
            <MainTitle>Continue Call</MainTitle>
            <Description>
                Are you sure you want to continue the call? The callee provided
                the following identifications:
            </Description>
            {/* List all ICT */}
            <ul className="flex flex-col">
                <li className="flex justify-center">
                    <UserBlock username="turing" />
                </li>
            </ul>
            <div className="flex space-x-4 justify-center">
                <Button
                    onClick={onClickNo}
                    className="bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    Close
                </Button>
                <Button
                    onClick={onClickYes}
                    className="bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    Start
                </Button>
            </div>
        </>
    );
}
