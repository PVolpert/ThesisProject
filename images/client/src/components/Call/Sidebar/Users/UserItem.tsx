import UserBlock from '../../../UI/UserBlock';

interface UserItemProps {
    username: string;
    isChecked: boolean;
    onCheckedChangeHandler: () => void;
    // userIcon: URL;
    callFct: () => void;
}

export default function UserItem({
    username,
    callFct,
    isChecked,
    onCheckedChangeHandler,
}: UserItemProps) {
    return (
        <li
            className={`first:rounded-t-lg last:rounded-b-lg flex space-x-3 justify-between content-center p-2 bg-zinc-300 dark:bg-zinc-700  hover:brightness-110 hover:-translate-y-0.5 transition duration-1050 ${
                isChecked ? 'border border-springblue' : ''
            }`}
        >
            <UserBlock username={username} />
            <span className="flex justify-around space-x-3">
                <button
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-springblue hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050"
                    onClick={callFct}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                        />
                    </svg>
                </button>
                <input
                    type="checkbox"
                    id={`checkbox_${username}`}
                    className="hidden"
                    checked={isChecked}
                    onChange={onCheckedChangeHandler}
                />
                <label
                    htmlFor={`checkbox_${username}`}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2  text-white transition duration-1050  ${
                        isChecked
                            ? 'bg-springred hover:bg-inherit border-springred hover:text-springred'
                            : 'bg-springblue hover:bg-inherit border-springblue hover:text-springblue'
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 ${isChecked ? 'hidden' : ''}`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`w-6 h-6 ${isChecked ? '' : 'hidden'}`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 12h-15"
                        />
                    </svg>
                </label>
            </span>
        </li>
    );
}
