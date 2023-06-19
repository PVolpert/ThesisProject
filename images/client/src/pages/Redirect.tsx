import {
    LoaderFunctionArgs,
    redirect,
    useLoaderData,
    useNavigate,
} from 'react-router-dom';

import { OpenIDTokenEndpointResponse } from 'oauth4webapi';

import OIDCProvider from '../wrappers/Auth/OIDCProvider';
import { fetchTokenEndPointResponse } from '../wrappers/Auth/AuthCodeConsumer';
import { useZustandStore } from '../stores/zustand/ZustandStore';
import { loader as authProvidersLoader } from './Auth';
import { loader as ictProvidersLoader } from './Call';
import { useEffect } from 'react';

export default function RedirectPage() {
    const { tokenEndpointResponse, issuer } = useLoaderData() as {
        issuer: string;
        tokenEndpointResponse: OpenIDTokenEndpointResponse;
    };
    const navigate = useNavigate();

    const parseAuth = useZustandStore((state) => state.parseAuth);
    const parseICT = useZustandStore((state) => state.parseICT);

    useEffect(() => {
        //? Include a toast?
        if (!issuer) {
            parseAuth(tokenEndpointResponse);
        } else {
            parseICT(tokenEndpointResponse);
        }
        // Redirect when token is stored
        navigate('/call');
    }, []);

    return (
        <div>
            <p>Please wait while Login is confirmed</p>
        </div>
    );
}

export async function loader({ params, request }: LoaderFunctionArgs) {
    const authProviders = await authProvidersLoader();
    const ictProviders = await ictProvidersLoader();

    const { redirectId } = params;
    const searchParams = new URL(request.url).searchParams;
    if (!redirectId) {
        return redirect('/auth/login');
    }

    // Test if redirectId in authProviders
    let oidcProvider = matchRedirectId(authProviders, redirectId);
    let ictIssuer: string = '';
    // Test if redirectId in ictProviders
    if (!oidcProvider) {
        oidcProvider = matchRedirectId(ictProviders, redirectId);
        // Neither in authProviders nor ictProviders --> invalid redirect
        if (!oidcProvider) {
            console.log('redirect link does not match');

            return redirect('/auth/login');
        }
        ictIssuer = oidcProvider.info.issuer.href;
    }

    // Request Token from TokenEndPoint
    const tokenEndpointResponse = await fetchTokenEndPointResponse(
        oidcProvider,
        searchParams
    );

    return { issuer: ictIssuer, tokenEndpointResponse };
}

function matchRedirectId(oidcProviders: OIDCProvider[], redirectId: string) {
    const oidcProvider = oidcProviders.find((oidcProvider) => {
        if (redirectId) {
            return oidcProvider.info.redirect.pathname.endsWith(
                `/${redirectId}`
            );
        }
        return false;
    });
    return oidcProvider;
}
