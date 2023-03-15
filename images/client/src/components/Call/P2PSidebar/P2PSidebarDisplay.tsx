import AddAFriendButton from './AddAFriend/AddAFriendButton';
import DirectCall from './DirectCall/DirectCall';
import FriendsList from './Friend/FriendsList';

interface P2PSidebarDisplayProps {
    onRequestIATHandler: () => void;
}

export default function P2PSidebarDisplay({
    onRequestIATHandler,
}: P2PSidebarDisplayProps) {
    return (
        <div>
            <DirectCall onRequestIATHandler={onRequestIATHandler} />
            <FriendsList />
            <AddAFriendButton />
        </div>
    );
}
