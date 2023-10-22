import NoAndYesButtons from '../UI/NoAndYesButtons';
import OPNSelection from '../P2P/elems/OPNSelection';
import { ReactNode } from 'react';

interface ConfirmIncomingProps {
    children: ReactNode;
    username: string;
    checkedOPNCount: number;
    isOPNCheckedMap: Map<string, boolean>;
    setCheckedCount: React.Dispatch<React.SetStateAction<number>>;
    setIsCheckedMap: React.Dispatch<React.SetStateAction<Map<string, boolean>>>;
    onYesHandler: () => void;
    onNoHandler: () => void;
}

export default function ConfirmIncoming({
    children,
    checkedOPNCount,
    isOPNCheckedMap,
    setCheckedCount,
    setIsCheckedMap,
    onYesHandler,
    onNoHandler,
}: ConfirmIncomingProps) {
    return (
        <div className="flex flex-col space-y-4 p-4">
            {children}

            <OPNSelection
                isCheckedMap={isOPNCheckedMap}
                setCheckedCount={setCheckedCount}
                setIsCheckedMap={setIsCheckedMap}
            />

            <NoAndYesButtons
                onNoHandler={onNoHandler}
                onYesHandler={onYesHandler}
                disabledYes={checkedOPNCount === 0}
            />
        </div>
    );
}
