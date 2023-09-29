import { ReactNode } from 'react';
import Page from '../../UI/Page';
import { Description, MainTitle } from '../../UI/Headers';
import AuthenticationBox from './AuthenticationBox';
import Button from '../../UI/Button';
import RadioItem from './RadioItem';
import OIDCProvider from '../../../helpers/Auth/OIDCProvider';
import { TokenSet } from '../../../store/slices/ICTAccessTokenSlice';

interface verifyCallerProps {
    callerIdentity: {
        issIcon: ReactNode;
        issName: string;
        mail: string;
        name: string;
    };
    trustedOIDCProvidersCallee: {
        oidcProvider: OIDCProvider;
        tokenSet: TokenSet | undefined;
    }[];
}

export default function verifyCaller({
    callerIdentity: { issIcon, issName, mail, name },
    trustedOIDCProvidersCallee,
}: verifyCallerProps) {
    return (
        <div className="flex flex-col space-y-4 mx-3">
            <MainTitle>Authenticate Caller?</MainTitle>
            <Description>
                The caller provided the following identity. The identity is
                verified using OIDC<sup>2</sup>. Please authenticate the user:
            </Description>
            <AuthenticationBox
                issIcon={issIcon}
                issName={issName}
                mail={mail}
                name={name}
            />

            <Description>
                The following OIDC-Providers were chosen as trusted. Please pick
                one:
            </Description>

            <div>
                {trustedOIDCProvidersCallee.map((value) => {
                    return (
                        <RadioItem
                            ictProvider={value.oidcProvider}
                            idToken={value.tokenSet?.idToken}
                            radioName="caller"
                        />
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
