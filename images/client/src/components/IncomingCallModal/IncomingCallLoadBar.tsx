import { ReactNode } from 'react';

import classes from './IncomingCallLoadBar.module.css';

interface OutgoingCallLoadBarProps {
    children?: ReactNode;
    className?: string;
    stage: 0 | 1;
}

export default function IncomingCallLoadbar({
    stage,
}: OutgoingCallLoadBarProps) {
    function chooseWidth(activeBar: boolean) {
        switch (stage) {
            case 0:
                return activeBar ? 'w-0' : 'w-[99%]';
            case 1:
                return activeBar ? 'w-[99%]' : 'w-0';
        }
    }

    return (
        <div className="relative flex-1 flex justify-between">
            <div
                className={`absolute top-1/2 left-0 h-4 -z-1 -translate-y-1/2 -translate-x-[1%]  bg-springred shadow-lg ${chooseWidth(
                    true
                )}`}
            ></div>
            <div
                className={`absolute top-1/2 right-0 h-4 -z-1 -translate-y-1/2 -translate-x-[1%]  bg-springblue shadow-lg ${chooseWidth(
                    false
                )}`}
            ></div>

            <div
                className={`${
                    stage >= 0 ? classes['active'] : ''
                } relative flex items-center justify-center w-16  h-16  rounded-full border-2 border-springblue bg-springblue text-white font-mono text-xl shadow-lg`}
            >
                A
            </div>
            <div
                className={`${
                    stage >= 1 ? classes['active'] : ''
                } relative flex items-center justify-center w-16 h-16 rounded-full border-2 border-springblue bg-springblue text-white  font-mono text-xl shadow-lg`}
            >
                A
            </div>
        </div>
    );
}
