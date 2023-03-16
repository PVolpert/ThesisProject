import Button from '../../../UI/Button';
import classes from './DirectCallDisplay.module.css';

interface DirectCallDisplayProps {
    onRequestIATHandler: () => void;
}

export default function DirectCallDisplay({
    onRequestIATHandler,
}: DirectCallDisplayProps) {
    return (
        <form className={classes['form']}>
            <div className={classes['text']}>
                <label>Enter a valid caller Id</label>
                <input name="userId" id="userId" type="text" />
            </div>
            <div className={classes['controls']}>
                <Button style="ternary" onClick={onRequestIATHandler}>
                    Test IAT
                </Button>
                <Button style="primary" isSubmit={true}>
                    Call
                </Button>
            </div>
        </form>
    );
}
