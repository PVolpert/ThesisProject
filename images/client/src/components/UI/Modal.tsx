import {createPortal} from 'react-dom'

import classes from './Modal.module.css'
import Card from './Card'

interface BackdropProps {
    onConfirm: () => void
}

interface ModalOverlayProps {
    children : React.ReactNode
}

interface ModalProps extends BackdropProps,ModalOverlayProps{
    
}

function Backdrop ({onConfirm}:BackdropProps) {
    return <div className={classes.backdrop} onClick={onConfirm}></div>
}

function ModalOverlay({children}:ModalOverlayProps) {
    return <Card className={classes.modal}>{children}</Card>
}

export default function Modal ({onConfirm,children}:ModalProps) {
    return <>
        {createPortal(<ModalOverlay>{children}</ModalOverlay>,document.getElementById('root-modal') as Element)}
        {createPortal(<Backdrop onConfirm={onConfirm}/>,document.getElementById('root-backdrop') as Element)}

    </>
}

