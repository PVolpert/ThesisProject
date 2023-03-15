import { LoaderFunctionArgs, redirect, useLoaderData } from 'react-router-dom';

import { OpenIDTokenEndpointResponse } from 'oauth4webapi';

import AuthInfoProvider from '../wrappers/Auth/AuthInfoProvider';
import { fetchTokenEndPointResponse } from '../wrappers/Auth/AuthCodeConsumer';
import { useTokenStore } from '../stores/TokenZustand';
import { loader as authInfoLoader } from './Auth';
import { useToken } from '../hooks/useToken';

export default function RedirectPage() {
    const tokenResponse = useLoaderData() as OpenIDTokenEndpointResponse;
    // Redirect when token is stored
    useToken({ needsToken: false });

    useTokenStore((state) => state.parse(tokenResponse));

    return (
        <div>
            <p>Please wait while Login is confirmed</p>
        </div>
    );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
    const authInfoProviders = await authInfoLoader();
    const { redirectId } = params;
    const searchParams = new URL(request.url).searchParams;
    if (!redirectId) {
        return redirect('/auth/login');
    }

    // Match redirectId to a redirect Url
    const authInfoProvider = matchRedirectId(authInfoProviders, redirectId);
    if (!authInfoProvider) {
        console.log('redirect link does not match');
        return redirect('/auth/login');
    }

    // Request Token from TokenEndPoint
    const tokenResponse = await fetchTokenEndPointResponse(
        authInfoProvider,
        searchParams
    );

    return tokenResponse;
}

function matchRedirectId(
    authInfoProviders: AuthInfoProvider[],
    redirectId: string
) {
    const authInfoProvider = authInfoProviders.find((authProvider) => {
        if (redirectId) {
            return authProvider.info.redirect.pathname.endsWith(
                `/${redirectId}`
            );
        }
        return false;
    });
    return authInfoProvider;
}
