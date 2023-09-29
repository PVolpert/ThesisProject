import { Description, MainTitle } from '../../UI/Headers';
import Button from '../../UI/Button';

import { UserInfo } from '../../../helpers/Signaling/User';
import UserBlock from '../../UI/UserBlock';

interface ConfirmConferenceProps {
    onClickYes: () => void;
    onClickNo: () => void;
    candidates: UserInfo[];
}

export default function ConfirmConference({
    onClickNo,
    onClickYes,
    candidates,
}: ConfirmConferenceProps) {
    return (
        <div className="flex flex-col space-y-4 p-4">
            <MainTitle> Conference? </MainTitle>
            <Description>
                Are you sure you want to start a conference with the following
                users?
            </Description>

            <div className="flex flex-col space-y-2">
                {candidates.map((candidate) => {
                    return <UserBlock username={candidate.username} />;
                })}
            </div>

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
