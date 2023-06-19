/**
 * Contains:
 *  - UserInfo
 *  - CallButton
 */

// TODO Model idToken --> User --> Friend Relationship

import Button from '../../../UI/Button';
import classes from './UserItem.module.css';
interface UserItemProps {
    userName: String;
    // userIcon: URL;
    callFct: () => void;
}

export default function UserItem({
    userName,
    // userIcon,
    callFct,
}: UserItemProps) {
    return (
        <li>
            <div className={classes['outer']}>
                <div className={classes['info']}>
                    {/* <span
                    className={classes['icon']}
                    style={{
                        backgroundImage: `url(${userIcon.href})`,
                    }}
                ></span> */}
                    <span className={classes['name']}>{userName}</span>
                </div>

                {/* Add call icon */}
                <Button onClick={callFct} style="primary">
                    Call
                </Button>
            </div>
        </li>
    );
}
