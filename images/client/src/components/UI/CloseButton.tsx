interface CloseButtonProps {
    onClickHandler: () => void;
}

export default function CloseButton({
    onClickHandler: closeHandler,
}: CloseButtonProps) {
    return (
        <button
            className=" hidden md:block md:absolute md:top-5 md:right-5 hover:opacity-20 hover:-translate-y-0.5 transition duration-1050"
            onClick={closeHandler}
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
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
}
