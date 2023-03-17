import AddAFriend from './AddAFriend/AddAFriend';
import AddAFriendButton from './AddAFriend/AddAFriendButton';
import DirectCall from './DirectCall/DirectCall';
import FriendsList from './Friend/FriendsList';
import { AddAFriendModal } from './P2PSidebar';

import classes from './P2PSidebarDisplay.module.css';
interface P2PSidebarDisplayProps {
    onRequestIATHandler: () => void;
    addAFriendModal: AddAFriendModal;
}

export default function P2PSidebarDisplay({
    onRequestIATHandler,
    addAFriendModal,
}: P2PSidebarDisplayProps) {
    const {
        isModalShown: isAddAFriendShown,
        hideModal: hideAddAFriend,
        showModal: showAddAFriend,
    } = addAFriendModal;
    return (
        <div className={classes['side-bar']}>
            <DirectCall onRequestIATHandler={onRequestIATHandler} />
            <FriendsList />
            <AddAFriendButton showAddAFriend={showAddAFriend} />
            {isAddAFriendShown && (
                <AddAFriend hideAddAFriend={hideAddAFriend} />
            )}
        </div>
    );
}
