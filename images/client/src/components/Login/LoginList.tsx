import LoginItem from './LoginItem';
import { serviceProviders } from '../../helpers/Auth/OIDCProviderInfo';

export default function LoginList() {
    const items = serviceProviders.map((serviceProvider, index) => (
        <LoginItem key={index} authProvider={serviceProvider} />
    ));

    if (!items.length) {
        return <p>No valid Authentication Providers</p>;
    }

    return <ul className="flex flex-col space-y-6">{items}</ul>;
}
