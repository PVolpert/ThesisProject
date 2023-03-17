import Button from '../../../UI/Button';

interface AddAFriendButtonProps {
    showAddAFriend: () => void;
}

export default function AddAFriendButton({
    showAddAFriend,
}: AddAFriendButtonProps) {
    return (
        <Button style="primary" onClick={showAddAFriend}>
            Add a friend
        </Button>
    );
}
