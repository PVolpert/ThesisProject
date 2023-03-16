//(optional) implement call option button

import Button from '../../UI/Button';

/**
 * Button that opens Call Options
 * Design based on a options button
 * Takes in setIsShowCallOptions and return true
 */

interface CallOptionsButtonProps {
    showCallOptions: () => void;
}

export default function CallOptionsButton({
    showCallOptions,
}: CallOptionsButtonProps) {
    return (
        <Button onClick={showCallOptions} style="secondary">
            Config
        </Button>
    );
}
