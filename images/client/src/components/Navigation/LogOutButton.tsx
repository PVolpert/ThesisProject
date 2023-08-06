import Button from '../UI/Button';

interface LogOutButtonProps {
    className?: string;
    logOutHandler: () => void;
}

export default function LogOutButton({
    className,
    logOutHandler,
}: LogOutButtonProps) {
    return (
        <Button
            onClick={logOutHandler}
            className={`border-springred text-white hover:text-springred bg-springred hover:bg-inherit ${className}`.trim()}
        >
            <div className="flex space-x-2 place-content-center">
                {/* logout icon */}
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
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                </svg>

                <p>Log out</p>
            </div>
        </Button>
    );
}
