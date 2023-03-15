// TODO Implement DirectCall

import DirectCallDisplay from './DirectCallDisplay';

/**
 * Form
 */
interface DirectCallProps {
    onRequestIATHandler: () => void;
}
export default function DirectCall({ onRequestIATHandler }: DirectCallProps) {
    return <DirectCallDisplay onRequestIATHandler={onRequestIATHandler} />;
}
