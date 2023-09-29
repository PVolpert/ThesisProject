import ICTAuthItem from './ICTAuthItem';
import { Description, MainTitle } from '../../UI/Headers';
import { ictProviders } from '../../../helpers/Auth/OIDCProviderInfo';

export default function ICTAuthList() {
    const items = ictProviders.map((ictProvider, index) => {
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
        </div>
    );
}
