import { Description, MainTitle } from '../../UI/Headers';
import Button from '../../UI/Button';
import UserBlock from '../../UI/UserBlock';
import { useStore } from '../../../store/Store';

interface ConfirmCallProps {
    onClickYes: () => void;
    onClickNo: () => void;
}

export default function ConfirmCall({
    onClickNo,
    onClickYes,
}: ConfirmCallProps) {
    const username = useStore((state) => state.calleeUserName);
    return (
        <>
            <MainTitle> Call {username || 'Unkown'}? </MainTitle>
            <Description>
                Are you sure you want to call {username || 'Unknown'}? You
                currently use the following identifications:
            </Description>
            {/*TODO: List all  ICT Tokens here*/}
            <ul className="flex flex-col">
                <li className="flex justify-center">
                    <UserBlock username="turing" />
                </li>
            </ul>
            <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4 justify-center">
                <Button
                    onClick={onClickNo}
                    className="bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    No
                </Button>
                <Button
                    onClick={onClickYes}
                    className="bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    Yes
                </Button>
            </div>
        </>
    );
}
