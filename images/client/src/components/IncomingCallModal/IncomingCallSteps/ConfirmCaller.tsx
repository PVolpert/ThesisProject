import { Description, MainTitle } from '../../UI/Headers';
import Button from '../../UI/Button';
import UserBlock from '../../UI/UserBlock';

interface ConfirmCallerProps {
    onClickYes: () => void;
    onClickNo: () => void;
}

export default function ConfirmCaller({ onClickYes }: ConfirmCallerProps) {
    return (
        <>
            {/* TODO Insert Call ID */}
            <MainTitle> Accept Call? </MainTitle>
            <Description>
                You are getting called. Do you want to accept the call? The
                caller has the following identifications.
            </Description>
            {/* List all  ICT Tokens here*/}
            <ul className="flex flex-col">
                <li className="flex justify-center">
                    <UserBlock username="turing" />
                </li>
            </ul>
            <div className="flex space-x-4 justify-center">
                <Button className="bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050">
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
