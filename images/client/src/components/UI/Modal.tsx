import { createPortal } from 'react-dom';

import Card from './Card';

interface BackdropProps {
    onHideModal: () => void;
}

interface ModalOverlayProps {
    children: React.ReactNode;
}

interface ModalProps extends BackdropProps, ModalOverlayProps {}

function Backdrop({ onHideModal }: BackdropProps) {
    return (
        <div
            className="absolute top-0 left-0 w-full h-screen z-5 bg-white bg-opacity-20 backdrop-blur-sm"
            onClick={onHideModal}
        ></div>
    );
}

function ModalOverlay({ children }: ModalOverlayProps) {
    return (
        <div className="absolute top-[10%] md:top-1/4 left-1/2 overflow-hidden overflow-y-auto  z-10 -translate-x-1/2 -translate-y-[10%]">
            <Card>{children}</Card>
        </div>
    );
}

export default function Modal({ onHideModal, children }: ModalProps) {
    return (
        <>
            {createPortal(
                <ModalOverlay>{children}</ModalOverlay>,
                document.getElementById('root-modal') as Element
            )}
            {createPortal(
                <Backdrop {...{ onHideModal }} />,
                document.getElementById('root-backdrop') as Element
            )}
        </>
    );
}
