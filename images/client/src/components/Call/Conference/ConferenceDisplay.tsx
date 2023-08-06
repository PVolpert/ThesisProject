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
        <div className="hidden">
            <form className="">
                <div className="">
                    <label>Select a conference name:</label>
                    <input
                        type="text"
                        id="conference"
                        name="conference"
                        required
                    />
                </div>
                <div className="">
                    <Button className="">Random</Button>
                    <Button type="submit">Join</Button>
                </div>
            </form>
        </div>
    );
}
