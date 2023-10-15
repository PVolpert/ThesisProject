import { Description, MainTitle } from '../../UI/Headers';
import Button from '../../UI/Button';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import { ictProviders } from '../../../helpers/Auth/OIDCProviderInfo';

interface ConfirmCallerProps {
    onClickYes: () => void;
    onClickNo: () => void;
    onCheckBoxChangeHandlerBuilder: (ictProvider: OIDCProvider) => () => void;
    checkedCount: number;
    formData: Map<string, boolean>;
    username: string;
}

export default function ConfirmCaller({
    onClickYes,
    onClickNo,
    onCheckBoxChangeHandlerBuilder,
    checkedCount,
    formData,
    username,
}: ConfirmCallerProps) {
    return (
        <div className="flex flex-col space-y-4 p-4">
            <MainTitle> Accept Call? </MainTitle>
            <Description>
                You are getting called by {username}. Do you want to accept the
                call? The caller has the following identifications.
            </Description>

            <div className="flex flex-col md:flex-row md:space-y-0 space-y-1 md: space-x-2">
                <Description>
                    Pick at least one trusted OIDC Provider:
                </Description>
                {ictProviders.map((ictProvider) => {
                    return (
                        <div id={ictProvider.info.name}>
                            <input
                                type="checkbox"
                                id={`checkbox_${ictProvider.info.name}`}
                                className="hidden"
                                checked={
                                    formData.get(
                                        `checkbox_${ictProvider.info.name}`
                                    ) ?? false
                                }
                                onChange={onCheckBoxChangeHandlerBuilder(
                                    ictProvider
                                )}
                            />

                            <label
                                htmlFor={`checkbox_${ictProvider.info.name}`}
                            >
                                <div
                                    key={ictProvider.info.name}
                                    className={`flex items-center justify-center w-full py-2 space-x-3  border rounded shadow-sm hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 transition duration-1050 ${
                                        formData.get(
                                            `checkbox_${ictProvider.info.name}`
                                        ) ?? false
                                            ? 'bg-springblue border-springblue'
                                            : 'bg-zinc-100 dark:bg-zinc-600 border-zinc-500'
                                    }`}
                                >
                                    <span className="w-6 h-6">
                                        {ictProvider.info.img}
                                    </span>
                                    <span className="font-thin">
                                        {ictProvider.info.name}
                                    </span>
                                </div>
                            </label>
                        </div>
                    );
                })}
            </div>

            <div className="flex space-x-4 justify-center">
                <Button
                    onClick={onClickNo}
                    className="bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050"
                >
                    No
                </Button>
                <Button
                    onClick={onClickYes}
                    disabled={checkedCount === 0}
                    className="bg-springblue hover:bg-inherit disabled:bg-inherit disabled:text-inherit disabled:cursor-not-allowed border-springblue hover:text-springblue text-white transition duration-1050"
                >
                    Yes
                </Button>
            </div>
        </div>
    );
}
