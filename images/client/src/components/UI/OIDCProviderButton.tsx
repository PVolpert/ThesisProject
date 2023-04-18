import classes from './OIDCProviderButton.module.css';

interface OIDCProviderButtonProps {
    id: string;
    onClick: () => void;
    logo: URL;
    text: string;
    isTokenActive: boolean;
}

export default function OIDCProviderButton({
    id,
    onClick,
    logo,
    text,
    isTokenActive,
}: OIDCProviderButtonProps) {
    return (
        // TODO Move li outside + Redo css
        <li key={id} className={classes.item}>
            <button onClick={onClick} disabled={isTokenActive}>
                <span
                    className={classes['item__logo']}
                    style={{
                        backgroundImage: `url(${logo.href})`,
                    }}
                ></span>
                <span className={classes['item__text']}>{text}</span>
            </button>
        </li>
    );
}
