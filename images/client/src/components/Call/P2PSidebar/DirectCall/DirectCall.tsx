import { useNavigate } from 'react-router-dom';
import DirectCallDisplay from './DirectCallDisplay';

interface DirectCallProps {
    onRequestICTHandler: () => void;
}
export default function DirectCall({ onRequestICTHandler }: DirectCallProps) {
    const navigate = useNavigate();

    function dummySubmitHandler(event: React.FormEvent<string>) {
        console.log(event);
        navigate('/call/p2p');
    }

    return (
        <DirectCallDisplay
            onRequestICTHandler={onRequestICTHandler}
            submitHandler={dummySubmitHandler}
        />
    );
}
