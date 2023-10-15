import { useState } from 'react';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import { IDToken } from 'oauth4webapi';
import { useStore } from '../../../store/Store';
import AuthCodeProvider from '../../../helpers/Auth/AuthCodeProvider';
import OIDCProviderButton from '../../UI/OIDCProviderButton';

interface RadioItemProps {
    ictProvider: OIDCProvider;
    idToken?: IDToken;
    radioName: string;
    onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioItem({
    ictProvider,
    idToken,
    radioName,
    onChangeHandler,
}: RadioItemProps) {
    const [authCodeProvider] = useState(new AuthCodeProvider(ictProvider));
    const parseICT = useStore((state) => state.parseICT);

    window.onmessage = (ev) => {
        try {
            const parsedData = JSON.parse(ev.data);
            const { type = '', data = {} } = parsedData;
            if (type === 'OIDCtokens') {
                parseICT(data);
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                // Handle syntax errors separately (if needed)
                return;
                // You can choose to ignore syntax errors or take specific action
            } else {
                console.log(error);
            }
        }
    };

    return (
        <div
            className="flex space-x-2  items-center justify-center"
            key={ictProvider.info.name}
        >
            {!idToken && (
                <OIDCProviderButton
                    onClick={() => {
                        authCodeProvider.openNewWindowToProviderHandler();
                    }}
                    logo={ictProvider.info.img}
                    text={`Connect to ${ictProvider.info.name}`}
                    isTokenActive={!!idToken}
                />
            )}
            {idToken && (
                <label
                    htmlFor={`radio_${ictProvider.info.name}`}
                    className="flex cursor-pointer items-center justify-center w-full py-2 space-x-3 bg-zinc-100 dark:bg-zinc-600 border border-zinc-500 rounded shadow-sm"
                >
                    <span className="w-6 h-6">{ictProvider.info.img}</span>
                    <span className="">
                        Continue as {idToken.name?.toString()}
                    </span>
                </label>
            )}
            <input
                className="h-8 w-8  cursor-pointer accent-springblue "
                type="radio"
                name={radioName}
                id={`radio_${ictProvider.info.name}`}
                value={ictProvider.info.name}
                disabled={!idToken}
                onChange={onChangeHandler}
            />
        </div>
    );
}
