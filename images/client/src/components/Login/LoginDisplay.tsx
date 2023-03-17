import Card from '../UI/Card';
import LoginList from './LoginList';
import classes from './LoginDisplay.module.css';

export default function LoginDisplay() {
    return (
        <Card className={classes.auth}>
            <header className={classes['auth__description']}>
                <h3>Welcome!</h3>
                <p>Log in to continue.</p>
            </header>
            <LoginList />
        </Card>
    );
}
