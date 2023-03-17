import Modal from '../../../UI/Modal';
import AddAFriendForm from './AddAFriendForm';
import FriendRequestList from './FriendRequestList';

import classes from './AddAFriendDisplay.module.css';
/**
 * Creates GUI for Modal with
 * - Tab 1: Form
 * - Tab 2: RequestList
 * Tabs are switchable
 */

interface AddAFriendDisplayProps {
    hideAddAFriend: () => void;
}

export default function AddAFriendDisplay({
    hideAddAFriend,
}: AddAFriendDisplayProps) {
    return (
        <Modal onDismiss={hideAddAFriend}>
            <div className="tab-A">
                <p className={classes['tab-name']}>New Request</p>
                <div className={classes['tab-content']}>
                    <AddAFriendForm />
                </div>
            </div>
            <div className="tab-B">
                <p className={classes['tab-name']}>New Request</p>
                <div className={classes['tab-content']}>
                    <FriendRequestList />
                </div>
            </div>
        </Modal>
    );
}
