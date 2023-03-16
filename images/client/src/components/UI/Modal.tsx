import { createPortal } from 'react-dom';

import classes from './Modal.module.css';
import Card from './Card';

interface BackdropProps {
    onDismiss: () => void;
}

interface ModalOverlayProps {
    children: React.ReactNode;
}

interface ModalProps extends BackdropProps, ModalOverlayProps {}

function Backdrop({ onDismiss }: BackdropProps) {
    return <div className={classes.backdrop} onClick={onDismiss}></div>;
}

function ModalOverlay({ children }: ModalOverlayProps) {
    return <Card className={classes.modal}>{children}</Card>;
}

export default function Modal({ onDismiss, children }: ModalProps) {
    return (
        <>
            {createPortal(
                <ModalOverlay>{children}</ModalOverlay>,
                document.getElementById('root-modal') as Element
            )}
            {createPortal(
                <Backdrop onDismiss={onDismiss} />,
                document.getElementById('root-backdrop') as Element
            )}
        </>
    );
}
