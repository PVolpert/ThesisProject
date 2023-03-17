//(optional) Implement AddAFriend

import AddAFriendDisplay from './AddAFriendDisplay';

/**
 * Modal for requesting Friends and accepting open friend requests
 * - Invoked by add a friend button
 * - Tab for friend request form
 * - Tab for open friend request
 */

interface AddAFriendProps {
    hideAddAFriend: () => void;
}

export default function AddAFriend({ hideAddAFriend }: AddAFriendProps) {
    return <AddAFriendDisplay hideAddAFriend={hideAddAFriend} />;
}
