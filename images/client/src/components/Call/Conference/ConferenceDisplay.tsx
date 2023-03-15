/**
 * Match space with sidebar
 * Secondary Background
 * Primary Box with Form inside centered
 */

import Button from '../../UI/Button';
import classes from './ConferenceDisplay.module.css';

export default function ConferenceDisplay() {
    return (
        // ? change form to react-router Form
        <div className={classes['outer-box']}>
            <form className={classes['form']}>
                <div className={classes['Input']}>
                    <label>Select a conference name:</label>
                    <input
                        type="text"
                        id="conference"
                        name="conference"
                        required
                    />
                </div>
                <div className={classes['controls']}>
                    <Button style="secondary">Random</Button>
                    <Button style="primary" isSubmit={true}>
                        Join
                    </Button>
                </div>
            </form>
        </div>
    );
}
