import ICTAuthItem from './ICTAuthItem';
import { useStore } from '../../../store/Store';
import { Description, MainTitle } from '../../UI/Headers';
import { ictProviders } from '../../../helpers/Auth/OIDCProviderInfo';
import Button from '../../UI/Button';
import { createKeyPair, getICT } from '../../../helpers/ICT/ICT';

export default function ICTAuthList() {
    const ictTokens = useStore((state) => state.ictTokenSets);

    const items = ictProviders.map((ictProvider, index) => {
        let tokenSet = ictTokens.find((ictToken) => {
            return ictToken.idToken.iss == ictProvider.info.issuer.href;
        });
        if (tokenSet && tokenSet.accessToken && tokenSet.idToken) {
            const accessToken = tokenSet.accessToken;
            const idToken = tokenSet.idToken;
            const tokenSetFunction = () => {
                createKeyPair()
                    .then((keypair) =>
                        getICT(keypair, accessToken, idToken, ictProvider.info)
                    )
                    .then((ict) => {
                        console.log(ict);
                    });
            };

            return (
                <Button onClick={tokenSetFunction}>
                    Get ICT from {ictProvider.info.name}{' '}
                </Button>
            );
        }
        return <ICTAuthItem key={index} ictProvider={ictProvider} />;
    });

    if (!items.length) {
        return <p>No valid Authentication Providers</p>;
    }

    return (
        <div className="flex flex-col space-y-2 p-4 md:self-center">
            <MainTitle>Call Identity</MainTitle>
            <Description>
                Log in to one or more call identity provider
            </Description>
            <ul>{items}</ul>
            {/* Background whirls here */}
        </div>
    );
}
