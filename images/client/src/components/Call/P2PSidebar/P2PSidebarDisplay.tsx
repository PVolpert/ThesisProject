import AddAFriend from './AddAFriend/AddAFriend';
import AddAFriendButton from './AddAFriend/AddAFriendButton';
import DirectCall from './DirectCall/DirectCall';
import UserList from './Users/UserList';
import { AddAFriendModal } from './P2PSidebar';

import classes from './P2PSidebarDisplay.module.css';
interface P2PSidebarDisplayProps {
    onRequestICTHandler: () => void;
    addAFriendModal: AddAFriendModal;
}

export default function P2PSidebarDisplay({
    onRequestICTHandler,
    addAFriendModal,
}: P2PSidebarDisplayProps) {
    const {
        isModalShown: isAddAFriendShown,
        hideModal: hideAddAFriend,
        showModal: showAddAFriend,
    } = addAFriendModal;
    return (
        <div className={classes['side-bar']}>
            {/* <DirectCall onRequestICTHandler={onRequestICTHandler} /> */}
            <UserList />
            {/* <AddAFriendButton showAddAFriend={showAddAFriend} />
            {isAddAFriendShown && (
                <AddAFriend hideAddAFriend={hideAddAFriend} />
            )} */}
        </div>
    );
}
