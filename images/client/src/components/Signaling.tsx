import useSignaling from '../hooks/useSignaling';
import { useEffect } from 'react';

import { useStore } from '../store/Store';
import { Message, SdpMessage } from '../helpers/Signaling/Messages';
import { useToken } from '../hooks/useToken';

export default function Signaling() {
    const { signalingUrl } = useToken();
    const {
        socket: { lastJsonMessage, readyState },
    } = useSignaling({ socketUrl: signalingUrl });
    const isRTCConnectionActive = useStore((state) => {
        return state.shouldBlockOutsideOffers;
    });

    const setIncomingOffer = useStore((state) => state.setIncomingOffer);
    const setCallPartner = useStore((state) => state.setCallPartner);
    const showIncomingCallModal = useStore(
        (state) => state.showIncomingCallModal
    );
    const setSignalingConnectionState = useStore(
        (state) => state.setSignalingConnectionState
    );

    useEffect(() => {
        // Update store value of ready state
        setSignalingConnectionState(readyState);
    }, [readyState]);

    //* Handle incoming websocket messages of type call offer
    useEffect(() => {
        // Ignore initial empty value
        if (!lastJsonMessage) {
            return;
        }
        // Do nothing if already in a call
        if (isRTCConnectionActive) {
            return;
        }

        // filter out messages without type
        const { type } = lastJsonMessage as Message;
        if (!type) {
            console.error(
                'socket message is invalid: missing socket message type'
            );
            return;
        }
        if (type === 'call-offer') {
            const { origin, body: { desc } = {} } =
                lastJsonMessage as SdpMessage;
            // Check if message has a origin element
            if (!origin) {
                console.error('missing message origin');
                return;
            }
            // Check if message has a desc element
            if (!desc) {
                console.error('missing sdp in message body');
                return;
            }
            // TODO: Add a ICT

            // Add call-offer to store
            setIncomingOffer(desc);
            // Add call partner to store
            setCallPartner(origin);
            // Open Incoming Call Modal
            showIncomingCallModal();
        }
    }, [lastJsonMessage]);

    return <></>;
}
