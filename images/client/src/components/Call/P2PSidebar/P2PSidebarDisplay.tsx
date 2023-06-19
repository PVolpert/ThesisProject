import UserList from './Users/UserList';

import classes from './P2PSidebarDisplay.module.css';
interface P2PSidebarDisplayProps {}

export default function P2PSidebarDisplay({}: P2PSidebarDisplayProps) {
    return (
        <div className={classes['side-bar']}>
            <UserList />
        </div>
    );
}
