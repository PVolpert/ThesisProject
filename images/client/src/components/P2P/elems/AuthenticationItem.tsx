import { ReactNode } from 'react';
import UserIcon from '../../UI/UserIcon';
import { Description } from '../../UI/Headers';

interface AuthenticationItemProps {
    name: string;
    mail: string;
    issImg: ReactNode;
    issName: string;
    checked: boolean;
    onCheckBoxChangeHandler: () => void;
}

export default function AuthenticationItem({
    name,
    mail,
    issImg: issImg,
    issName,
    checked,
    onCheckBoxChangeHandler,
}: AuthenticationItemProps) {
    return (
        <div className="flex space-x-2 items-center justify-center hover:brightness-130  hover:-translate-y-0.5 transition duration-1050">
            <label
                htmlFor={name + issName}
                className="cursor-pointer md:max-w-sm flex-initial grid grid-cols-[min-content_min-content_min-content_min-content] gap-4 p-2 place-items-center border rounded-lg"
            >
                <div className="w-6 h-6">{issImg}</div>
                {/* UserIcon */}
                <span className="font-thin whitespace-nowrap">{issName}</span>
                <UserIcon
                    initial={name[0]}
                    className="bg-springblue border-springblue text-white"
                ></UserIcon>
                {/* username */}
                <div>
                    <h4 className="text-lg font-semibold">{name}</h4>
                    {/* name */}
                    <Description>{mail}</Description>
                </div>
            </label>
            <input
                type="checkbox"
                className="cursor-pointer w-8 h-8 accent-springblue"
                id={name + issName}
                checked={checked}
                onChange={onCheckBoxChangeHandler}
            />
        </div>
    );
}
