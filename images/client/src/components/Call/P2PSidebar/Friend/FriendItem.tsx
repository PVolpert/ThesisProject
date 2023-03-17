/**
 * Contains:
 *  - UserInfo
 *  - CallButton
 */

// TODO Model idToken --> User --> Friend Relationship

import Button from '../../../UI/Button';
import classes from './FriendItem.module.css';
interface FriendItemProps {
    userName: string;
    userIcon: URL;
    // ? already bound to userId
    callFct: () => void;
}

export default function FriendItem({
    userName,
    userIcon,
    callFct,
}: FriendItemProps) {
    return (
        <div className={classes['outer']}>
            <div className={classes['info']}>
                <span
                    className={classes['icon']}
                    style={{
                        backgroundImage: `url(${userIcon.href})`,
                    }}
                ></span>
                <span className={classes['name']}>{userName}</span>
            </div>

            {/* Add call icon */}
            <Button onClick={callFct} style="primary"></Button>
        </div>
    );
}
