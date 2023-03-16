interface IconButtonProps {
    accessability: string;
    onClick?: () => void;
    svg: React.SVGProps<SVGSVGElement>;
}

export default function IconButton({
    accessability,
    onClick,
    svg,
}: IconButtonProps) {
    let clickHandler = () => console.log('I was clicked');
    if (onClick) {
        clickHandler = onClick;
    }
    return (
        <button onClick={clickHandler}>
            <>
                {svg}
                {accessability}
            </>
        </button>
    );
}
