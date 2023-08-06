import { useState } from 'react';

interface useDisplayToggeProps {
    shownInitial: boolean;
}

export default function useDisplayToggle({
    shownInitial,
}: useDisplayToggeProps) {
    const [isShown, setIsShown] = useState(shownInitial);
    function hideModal() {
        setIsShown(false);
    }
    function showModal() {
        setIsShown(true);
    }

    return {
        isShown,
        hideModal,
        showModal,
    };
}
