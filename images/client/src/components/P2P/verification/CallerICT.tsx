import Button from '../../UI/Button';
import { Description, MainTitle } from '../../UI/Headers';
import RadioItem from './RadioItem';
import { ictProviders } from '../../../helpers/Auth/OIDCProviderInfo';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import { TokenSet } from '../../../store/slices/ICTAccessTokenSlice';

interface CallerICTProps {
    candidates: Map<
        string,
        {
            oidcProvider: OIDCProvider;
            tokenSet: TokenSet | undefined;
        }[]
    >;
}

export default function CallerICT({ candidates }: CallerICTProps) {
    return (
        <div className="flex flex-col space-y-4 mx-3">
            <MainTitle>Acquire ICT</MainTitle>
            <Description>
                The conference invitation was accepted by all users. The
                following OIDC-Providers were chosen as trusted.
            </Description>
            <div className="flex flex-col space-y-2">
                {[...candidates.entries()].map(([name, candidate]) => {
                    return (
                        <div className="flex flex-col space-y-2">
                            <Description>
                                Please pick a OIDC-Provider for {name}:
                            </Description>
                            {candidate.map((value) => {
                                return (
                                    <RadioItem
                                        ictProvider={value.oidcProvider}
                                        idToken={value.tokenSet?.idToken}
                                        radioName={name}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            <Description>Please pick OIDC-Providers you trust:</Description>

            <div className="flex flex-col space-y-2">
                {ictProviders.map((ictProvider) => {
                    return (
                        <div className="first:bg-springblue first:border-springblue even:bg-springblue even:border-springblue bg-zinc-100 dark:bg-zinc-600 border-zinc-500">
                            <input
                                type="checkbox"
                                id={`checkbox_${ictProvider.info.name}`}
                                className="hidden"
                                // checked={
                                //     formData.get(
                                //         `checkbox_${ictProvider.info.name}`
                                //     ) || false
                                // }
                                onChange={
                                    () => {}
                                    //     onCheckBoxChangeHandlerBuilder(
                                    //     ictProvider
                                    // )
                                }
                            />
                            <label
                                htmlFor={`checkbox_${ictProvider.info.name}`}
                            >
                                <div
                                    key={ictProvider.info.name}
                                    className={`flex items-center justify-center w-full py-2 space-x-3  border rounded shadow-sm hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 transition duration-1050 ${
                                        ''
                                        // formData.get(
                                        //     `checkbox_${ictProvider.info.name}`
                                        // ) || false
                                        //     ? 'bg-springblue border-springblue'
                                        //     : 'bg-zinc-100 dark:bg-zinc-600 border-zinc-500'
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

            <div className="flex flex-col  md:flex-row md:space-x-4 md:space-y-0 space-y-4 justify-center md:self-center">
                <Button className="justify-center flex flex-1  bg-springred  hover:bg-inherit border-springred hover:text-springred text-white transition duration-1050">
                    Cancel
                </Button>
                <Button className="justify-center flex flex-1 bg-springblue  hover:bg-inherit border-springblue hover:text-springblue text-white transition duration-1050">
                    Continue
                </Button>
            </div>
        </div>
    );
}
