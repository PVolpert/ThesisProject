import AuthInfoProvider from '../../wrappers/Auth/AuthInfoProvider';
import classes from './LoginItem.module.css';

interface LoginItemProps {
    authInfoProvider: AuthInfoProvider;
}

export default function LoginItem({ authInfoProvider }: LoginItemProps) {
    const establishVerifier = () => {
        authInfoProvider.verifier.reset().create().store();
    };

    async function createAuthorizationURL(challenge: string): Promise<URL> {
        if (!authInfoProvider.authServer) {
            await authInfoProvider.createAuthServer();
        }

        const authorizationUrl = new URL(
            authInfoProvider.authServer.authorization_endpoint!
        );
        const { searchParams } = authorizationUrl;
        searchParams.set('client_id', authInfoProvider.client.client_id);
        searchParams.set('code_challenge', challenge);
        searchParams.set(
            'code_challenge_method',
            authInfoProvider.code_challenge_method
        );
        searchParams.set('redirect_uri', authInfoProvider.info.redirect.href);
        searchParams.set('response_type', 'code');
        searchParams.set('scope', 'openid email');

        return authorizationUrl;
    }

    // ? Show a toast
    async function redirectAuthHandler() {
        establishVerifier();

        const challenge = await authInfoProvider.createChallenge();
        const authorizationUrl = await createAuthorizationURL(challenge);

        window.location.assign(authorizationUrl.href);
    }

    return (
        <li key={authInfoProvider.info.name} className={classes.item}>
            <button onClick={redirectAuthHandler}>
                <span
                    className={classes['item__logo']}
                    style={{
                        backgroundImage: `url(${authInfoProvider.info.img.href})`,
                    }}
                ></span>
                <span className={classes['item__text']}>
                    Continue with {authInfoProvider.info.name}
                </span>
            </button>
        </li>
    );
}
