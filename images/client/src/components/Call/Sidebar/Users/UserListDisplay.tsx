import UserItem from './UserItem';

import { UserId, UserInfo } from '../../../../helpers/Signaling/User';
import { SubTitle } from '../../../UI/Headers';

interface UserListDisplayProps {
    userList: UserInfo[];
    onCallHandlerBuilder: (target: UserInfo) => () => void;
}

export default function UserListDisplay({
    userList,
    onCallHandlerBuilder,
}: UserListDisplayProps) {
    const items = userList.map((user) => {
        return (
            <UserItem
                key={user.issuer + user.subject}
                username={user.username}
                callFct={onCallHandlerBuilder(user)}
            />
        );
    });

    if (items.length === 0) {
        return <SubTitle>No active users :/</SubTitle>;
    }

    return <ul>{items}</ul>;
}
