import { useNavigate } from 'react-router-dom';
import DirectCallDisplay from './DirectCallDisplay';

interface DirectCallProps {
    onRequestIATHandler: () => void;
}
export default function DirectCall({ onRequestIATHandler }: DirectCallProps) {
    const navigate = useNavigate();

    function dummySubmitHandler(event: React.FormEvent<string>) {
        console.log(event);
        navigate('/call/p2p');
    }

    return (
        <DirectCallDisplay
            onRequestIATHandler={onRequestIATHandler}
            submitHandler={dummySubmitHandler}
        />
    );
}
