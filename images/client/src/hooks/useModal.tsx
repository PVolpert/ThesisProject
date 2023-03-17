import { useState } from 'react';

interface useModalProps {
    shownInitial: boolean;
}

export default function useModal({ shownInitial }: useModalProps) {
    const [isModalShown, setIsModalShown] = useState(shownInitial);
    function hideModal() {
        setIsModalShown(false);
    }
    function showModal() {
        setIsModalShown(true);
    }

    return {
        isModalShown,
        hideModal,
        showModal,
    };
}
