import { Description, MainTitle } from '../../UI/Headers';
import Button from '../../UI/Button';

import { UserId } from '../../../helpers/Signaling/User';

interface ConfirmCallProps {
    onClickYes: () => void;
    onClickNo: () => void;
    callee: UserId;
}

export default function ConfirmCall({
    onClickNo,
    onClickYes,
    callee,
}: ConfirmCallProps) {
    return (
        <div className="flex flex-col space-y-4 p-4">
            <MainTitle> Call {callee.username || 'Unkown'}? </MainTitle>
            <Description>
                Are you sure you want to call {callee.username || 'Unknown'}?
            </Description>

            <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4 justify-center">
                <Button
                    onClick={onClickNo}
                    className="justify-center bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    No
                </Button>
                <Button
                    onClick={onClickYes}
                    className="justify-center bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    Yes
                </Button>
            </div>
        </div>
    );
}
