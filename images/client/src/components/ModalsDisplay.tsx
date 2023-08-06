import { useStore } from '../store/Store';
import IncomingCallModal from './IncomingCallModal/IncomingCallModal';

import OutgoingCallModal from './OutgoingCallModal/OutgoingCallModal';
import SettingsModal from './Settings/SettingsModal';

interface ModalsProps {}

export default function Modals({}: ModalsProps) {
    const accessToken = useStore((state) => state.accessToken);

    const isSettingsModalShown = useStore(
        (state) => state.isSettingsModalShown
    );
    const isIncomingCallModalShown = useStore(
        (state) => state.isIncomingCallModalShown
    );

    const isOutgoingCallModalShown = useStore(
        (state) => state.isOutgoingCallModalShown
    );

    const isSignalModalShown = useStore((state) => state.isSignalModalShown);

    if (!accessToken) {
        return <></>;
    }
    return (
        <>
            {isSettingsModalShown && <SettingsModal />}
            {isIncomingCallModalShown && <IncomingCallModal />}
            {isOutgoingCallModalShown && <OutgoingCallModal />}
            {isSignalModalShown}
        </>
    );
}
