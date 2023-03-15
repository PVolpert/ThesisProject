import Button from '../../../UI/Button';

interface DirectCallDisplayProps {
    onRequestIATHandler: () => void;
}

export default function DirectCallDisplay({
    onRequestIATHandler,
}: DirectCallDisplayProps) {
    return (
        <form>
            <div>
                <label>Enter a valid caller Id</label>
                <input name="userId" id="userId" type="text" />
            </div>
            <div>
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
