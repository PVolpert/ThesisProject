import {
    LoaderFunctionArgs,
    redirect,
    useLoaderData,
    useNavigate,
} from 'react-router-dom';

import { OpenIDTokenEndpointResponse } from 'oauth4webapi';

import { fetchTokenEndPointResponse } from '../helpers/Auth/AuthCodeConsumer';
import { useStore } from '../store/Store';
// import { loader as authProvidersLoader } from './Auth';
// import { loader as ictProvidersLoader } from './Call';
import { useEffect } from 'react';
import OIDCProvider from '../helpers/Auth/OIDCProvider';
import {
    ictProviders,
    serviceProviders,
} from '../helpers/Auth/OIDCProviderInfo';
import { parseToken } from '../store/slices/AccessTokenSlice';

export default function RedirectPage() {
    const { tokenEndpointResponse, isServiceOP } = useLoaderData() as {
        isServiceOP: boolean;

        tokenEndpointResponse: OpenIDTokenEndpointResponse;
    };

    const navigate = useNavigate();

    const parseAuth = useStore((state) => state.parseAuth);

    useEffect(() => {
        //? Include a toast?
        if (isServiceOP) {
            parseAuth(tokenEndpointResponse);
            navigate('/call');
        } else {
            const newTokenPair = parseToken(tokenEndpointResponse);
            window.opener.postMessage(
                JSON.stringify({
                    type: 'OIDCtokens',
                    data: newTokenPair,
                }),
                `${import.meta.env.VITE_CLIENT_URL}`
            );
            window.close();
        }
        // Redirect when token is stored
    }, []);

    return (
        <div>
            <p>Please wait while Login is confirmed</p>
        </div>
    );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
    // Extract redirect id from dynamic route segment
    const { redirectId } = params;

    // Sanity check for dynamic segment name
    if (!redirectId) {
        throw "Identifier of dynamic segment must be 'redirectID'";
    }

    const { selectedOIDCProvider, isServiceOP } = searchICTandServiceOPs(
        serviceProviders,
        ictProviders,
        redirectId
    );

    // redirectId is not listed in OPs --> not valid --> redirect to home
    if (!selectedOIDCProvider) {
        return redirect('/');
    }

    const searchParams = new URL(request.url).searchParams;
    // Request Token from TokenEndPoint
    const tokenEndpointResponse = await fetchTokenEndPointResponse(
        selectedOIDCProvider,
        searchParams
    );

    return { isServiceOP, tokenEndpointResponse };
}

function searchICTandServiceOPs(
    serviceOPs: OIDCProvider[],
    ictOPs: OIDCProvider[],
    redirectId: string
) {
    let selectedOIDCProvider = matchRedirectId(serviceOPs, redirectId);

    if (selectedOIDCProvider) {
        return { selectedOIDCProvider, isServiceOP: true };
    }
    selectedOIDCProvider = matchRedirectId(ictOPs, redirectId);
    if (selectedOIDCProvider) {
        return { selectedOIDCProvider, isServiceOP: false };
    }
    return { selectedOIDCProvider: null, isServiceOP: false };
}

// matchRedirectId searches given list of Open Id Providers for a matching redirectId
function matchRedirectId(OPs: OIDCProvider[], redirectId: string) {
    const oidcProvider = OPs.find((oidcProvider) => {
        return oidcProvider.info.redirectId.pathname.endsWith(`/${redirectId}`);
    });
    return oidcProvider;
}
