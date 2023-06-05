import classes from './OIDCProviderButton.module.css';

interface OIDCProviderButtonProps {
    onClick: () => void;
    logo: URL;
    text: string;
    isTokenActive: boolean;
}

export default function OIDCProviderButton({
    onClick,
    logo,
    text,
    isTokenActive,
}: OIDCProviderButtonProps) {
    return (
        <div className={classes.item}>
            <button onClick={onClick} disabled={isTokenActive}>
                <span
                    className={classes['item__logo']}
                    style={{
                        backgroundImage: `url(${logo.href})`,
                    }}
                ></span>
                <span className={classes['item__text']}>{text}</span>
            </button>
        </div>
    );
}
