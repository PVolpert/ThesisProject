import Conference from './Conference/Conference';
import P2PSidebar from './P2PSidebar/P2PSidebar';
import classes from './CallDisplay.module.css';

export function CallDisplay() {
    return (
        <div className={classes['call']}>
            <P2PSidebar />
            <Conference />
        </div>
    );
}
