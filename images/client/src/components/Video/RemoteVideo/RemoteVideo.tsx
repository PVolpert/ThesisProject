interface remoteVideoProps {
    id: string;
    stream: MediaStream;
}

export default function RemoteVideo({ id, stream }: remoteVideoProps) {
    return (
        <li key={id}>
            <video key={id} />
        </li>
    );
}
