import LoadingStatement from '../LoadingStatement';
import Button from '../../UI/Button';
import { Description, MainTitle } from '../../UI/Headers';
import { useStore } from '../../../store/Store';

interface ShowSetupStepsProps {
    onClickYes?: () => void;
    onClickNo?: () => void;
}

export default function ShowSetupSteps({
    onClickNo,
    onClickYes,
}: ShowSetupStepsProps) {
    const ictLoadState = useStore((state) => state.ictOfferLoadState);
    const offerLoadState = useStore((state) => state.offerLoadState);
    const sendOfferLoadState = useStore((state) => state.sendOfferLoadState);
    const answerReceivedState = useStore((state) => state.answerReceivedState);

    function checkLoadState() {
        return ![
            ictLoadState,
            offerLoadState,
            sendOfferLoadState,
            answerReceivedState,
        ].every((loadState) => {
            return loadState == 'fulfilled';
        });
    }

    return (
        <>
            <MainTitle>Setting up the call</MainTitle>
            <Description>
                Please wait until the call setup steps are finished.
            </Description>
            <div className="flex flex-col space-y-4">
                <LoadingStatement
                    loadState={ictLoadState}
                    loadStatement="Requesting ICT Tokens"
                />
                <LoadingStatement
                    loadState={offerLoadState}
                    loadStatement="Creating Offer"
                />
                <LoadingStatement
                    loadState={sendOfferLoadState}
                    loadStatement="Sending Call Request"
                />
                <LoadingStatement
                    loadState={answerReceivedState}
                    loadStatement="Waiting for Response"
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
                    disabled={checkLoadState()}
                    className="bg-springred disabled:bg-inherit disabled:text-springred disabled:cursor-not-allowed  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    Continue
                </Button>
            </div>
        </>
    );
}
