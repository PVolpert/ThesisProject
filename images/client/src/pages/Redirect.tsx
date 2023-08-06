import {
    LoaderFunctionArgs,
    redirect,
    useLoaderData,
    useNavigate,
} from 'react-router-dom';

import { OpenIDTokenEndpointResponse } from 'oauth4webapi';

import { fetchTokenEndPointResponse } from '../helpers/Auth/AuthCodeConsumer';
import { useStore } from '../store/Store';
import { loader as authProvidersLoader } from './Auth';
import { loader as ictProvidersLoader } from './Call';
import { useEffect } from 'react';
import OIDCProvider from '../helpers/Auth/OIDCProvider';

export default function RedirectPage() {
    const { tokenEndpointResponse, isServiceOP } = useLoaderData() as {
        isServiceOP: boolean;

        tokenEndpointResponse: OpenIDTokenEndpointResponse;
    };

    const navigate = useNavigate();

    const parseAuth = useStore((state) => state.parseAuth);
    const parseICT = useStore((state) => state.parseICT);

    useEffect(() => {
        //? Include a toast?
        if (isServiceOP) {
            parseAuth(tokenEndpointResponse);
            navigate('/call');
        } else {
            parseICT(tokenEndpointResponse);
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
    //Request list of Open ID Providers for Service
    const serviceOPs = await authProvidersLoader();

    //Request list Open ID Providers for ICT
    const ictOPs = await ictProvidersLoader();

    // Extract redirect id from dynamic route segment
    const { redirectId } = params;

    // Sanity check for dynamic segment name
    if (!redirectId) {
        throw "Identifier of dynamic segment must be 'redirectID'";
    }

    const { OIDCProvider, isServiceOP } = searchICTandServiceOPs(
        serviceOPs,
        ictOPs,
        redirectId
    );

    // redirectId is not listed in OPs --> not valid --> redirect to home
    if (!OIDCProvider) {
        return redirect('/');
    }

    const searchParams = new URL(request.url).searchParams;
    // Request Token from TokenEndPoint
    const tokenEndpointResponse = await fetchTokenEndPointResponse(
        OIDCProvider,
        searchParams
    );

    return { isServiceOP, tokenEndpointResponse };
}

function searchICTandServiceOPs(
    serviceOPs: OIDCProvider[],
    ictOPs: OIDCProvider[],
    redirectId: string
) {
    let OIDCProvider = matchRedirectId(serviceOPs, redirectId);

    if (OIDCProvider) {
        return { OIDCProvider, isServiceOP: true };
    }

    OIDCProvider = matchRedirectId(ictOPs, redirectId);
    if (OIDCProvider) {
        return { OIDCProvider, isServiceOP: false };
    }

    return { OIDCProvider: null, isServiceOP: false };
}

// matchRedirectId searches given list of Open Id Providers for a matching redirectId
function matchRedirectId(OPs: OIDCProvider[], redirectId: string) {
    const oidcProvider = OPs.find((oidcProvider) =>
        oidcProvider.info.redirect.pathname.endsWith(`/${redirectId}`)
    );
    return oidcProvider;
}
