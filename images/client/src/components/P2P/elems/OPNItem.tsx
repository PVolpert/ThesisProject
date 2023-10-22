import { ReactNode } from 'react';
interface OPNItemProps {
    checked: boolean;
    ictProviderName: string;
    ictProviderImg: ReactNode;
    onChangeHandler: () => void;
}

export default function OPNItem({
    checked,
    ictProviderName,
    ictProviderImg,
    onChangeHandler,
}: OPNItemProps) {
    return (
        <div key={ictProviderName}>
            <input
                type="checkbox"
                id={ictProviderName}
                className="hidden"
                checked={checked}
                onChange={onChangeHandler}
                key={`${ictProviderName}input`}
            />
            <label htmlFor={ictProviderName}>
                <div
                    className={`flex items-center justify-center p-2 space-x-3 border rounded shadow-sm hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 transition duration-1050 ${
                        checked
                            ? 'bg-springblue border-springblue'
                            : 'bg-zinc-100 dark:bg-zinc-600 border-zinc-500'
                    }`}
                >
                    <span className="w-6 h-6">{ictProviderImg}</span>
                    <span className="font-thin">{ictProviderName}</span>
                </div>
            </label>
        </div>
    );
}
