import classes from './AuthItem.module.css';
import AuthInfoProvider from '../../wrappers/Auth/AuthInfoProvider';

interface AuthItemProps {
    authProvider: AuthInfoProvider;
}

export default function AuthItem({ authProvider }: AuthItemProps) {
    const establishVerifier = () => {
        authProvider.verifier.reset().create().store();
        console.log('Created Verifier: ', authProvider.verifier.verifier);
    };

    async function createAuthorizationURL(challenge: string): Promise<URL> {
        if (!authProvider.authServer) {
            await authProvider.createAuthServer();
        }

        const authorizationUrl = new URL(
            authProvider.authServer.authorization_endpoint!
        );
        authorizationUrl.searchParams.set(
            'client_id',
            authProvider.client.client_id
        );
        authorizationUrl.searchParams.set('code_challenge', challenge);
        authorizationUrl.searchParams.set(
            'code_challenge_method',
            authProvider.code_challenge_method
        );
        authorizationUrl.searchParams.set(
            'redirect_uri',
            authProvider.info.redirect.href
        );
        authorizationUrl.searchParams.set('response_type', 'code');
        authorizationUrl.searchParams.set('scope', 'openid email');

        return authorizationUrl;
    }

    // ? Show a toast
    async function redirectAuthHandler() {
        establishVerifier();

        const challenge = await authProvider.createChallenge();
        const authorizationUrl = await createAuthorizationURL(challenge);

        window.location.assign(authorizationUrl.href);
    }

    return (
        <li key={authProvider.info.name} className={classes.item}>
            <button onClick={redirectAuthHandler}>
                <span
                    className={classes['item__logo']}
                    style={{
                        backgroundImage: `url(${authProvider.info.img.href})`,
                    }}
                ></span>
                <span className={classes['item__text']}>
                    Continue with {authProvider.info.name}
                </span>
            </button>
        </li>
    );
}
