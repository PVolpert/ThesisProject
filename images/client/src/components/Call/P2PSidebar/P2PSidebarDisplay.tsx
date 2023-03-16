import AddAFriendButton from './AddAFriend/AddAFriendButton';
import DirectCall from './DirectCall/DirectCall';
import FriendsList from './Friend/FriendsList';

import classes from './P2PSidebarDisplay.module.css';
interface P2PSidebarDisplayProps {
    onRequestIATHandler: () => void;
}

export default function P2PSidebarDisplay({
    onRequestIATHandler,
}: P2PSidebarDisplayProps) {
    return (
        <div className={classes['side-bar']}>
            <DirectCall onRequestIATHandler={onRequestIATHandler} />
            <FriendsList />
            <AddAFriendButton />
        </div>
    );
}
