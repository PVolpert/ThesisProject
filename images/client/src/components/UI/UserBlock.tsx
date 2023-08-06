import { Description } from './Headers';
import UserIcon from './UserIcon';

interface UserBlockProps {
    username: string;
    name?: string;
}

export default function UserBlock({ username, name = '' }: UserBlockProps) {
    return (
        <div className="grid grid-cols-[min-content_1fr] gap-2 place-items-center">
            {/* UserIcon */}
            <UserIcon
                initial={username[0]}
                className="bg-springblue border-springblue text-white"
            ></UserIcon>
            {/* username */}
            <div>
                <h4 className="text-lg font-semibold">{username}</h4>
                {/* name */}
                {name && <Description>{name}</Description>}
            </div>
        </div>
    );
}
