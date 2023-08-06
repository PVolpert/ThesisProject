import UserIcon from '../UI/UserIcon';

interface DropDownButtonProps {
    isShowDropdown: boolean;
    hideDropdown: () => void;
    showDropdown: () => void;
    username: string;
}

export default function DropDownButton({
    isShowDropdown,
    hideDropdown,
    showDropdown,
    username,
}: DropDownButtonProps) {
    return (
        <button
            className=""
            onClick={isShowDropdown ? hideDropdown : showDropdown}
        >
            <UserIcon
                initial={username[0]}
                className="bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
            />
        </button>
    );
}
