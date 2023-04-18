import Button from '../../../UI/Button';
import classes from './DirectCallDisplay.module.css';

interface DirectCallDisplayProps {
    onRequestICTHandler: () => void;
    submitHandler: (event: React.FormEvent<string>) => void;
}

export default function DirectCallDisplay({
    onRequestICTHandler,
    submitHandler,
}: DirectCallDisplayProps) {
    return (
        <form className={classes['form']}>
            <div className={classes['text']}>
                <label>Enter a valid caller Id</label>
                <input name="userId" id="userId" type="text" />
            </div>
            <div className={classes['controls']}>
                <Button style="ternary" onClick={onRequestICTHandler}>
                    Test ICT
                </Button>
                <Button style="primary" isSubmit={true} onClick={submitHandler}>
                    Call
                </Button>
            </div>
        </form>
    );
}
