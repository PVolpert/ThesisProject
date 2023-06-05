import useWebSocket from 'react-use-websocket';

interface useSignalingProps {
    socketUrl: URL;
}

export default function useSignaling({ socketUrl }: useSignalingProps) {
    // connect to socket only if there exists an access token
    const socket = useWebSocket(socketUrl.href, {
        share: true,
    });

    return { socket };
}
