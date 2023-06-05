import { ReadyState } from 'react-use-websocket';
import useSignaling from '../hooks/useSignaling';
import { useCallback, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useZustandStore } from '../stores/zustand/ZustandStore';
import {
    Message,
    SdpMessage,
    createHangUpMessage,
} from '../wrappers/Signaling/Messages';
import { incomingCallHandler } from '../wrappers/Signaling/MessageHandlers';
import { useToken } from '../hooks/useToken';

export default function Signaling() {
    const { signalingUrl } = useToken();
    const {
        socket: { lastJsonMessage, sendJsonMessage, readyState },
    } = useSignaling({ socketUrl: signalingUrl });
    const navigate = useNavigate();
    const isRTCConnectionActive = useZustandStore((state) => {
        return state.isRTCConnectionActive;
    });
    const setSdpOffer = useZustandStore((state) => {
        return state.setSdpOffer;
    });

    const answerCall = useCallback((msg: SdpMessage) => {
        const { origin: { issuer, subject } = {} } = msg;

        //TODO Here we can extract and verify the ICT Tokens before RTCPeerConnction is up

        // if (window.confirm(`Accept the call from ${issuer}:${subject}?`)) {
        setSdpOffer(msg);
        navigate('/call/p2p');
        // } else {
        //     if (!msg.origin) {
        //         return;
        //     }
        //     const answerMsg = createHangUpMessage(msg.origin);
        //     sendJsonMessage(answerMsg);
        // }
    }, []);
    //* Side effect for incoming socket messages of type offer
    useEffect(() => {
        // Do nothing if already in a call
        if (isRTCConnectionActive || !lastJsonMessage) {
            return;
        }
        // filter out messages without type
        const { type } = lastJsonMessage as Message;
        if (!type) {
            console.error('missing socket message type');
            return;
        }

        if (type === 'call-offer') {
            // console.log('received call offer');
            incomingCallHandler(lastJsonMessage, answerCall);
        }
    }, [lastJsonMessage]);

    // * Translate ReadyState into string
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return <p>Status: {connectionStatus}</p>;
}
