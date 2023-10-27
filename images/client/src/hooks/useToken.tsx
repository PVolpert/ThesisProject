import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/Store';

interface useTokenProps {
    needsToken?: boolean;
}

export function useToken({ needsToken = undefined }: useTokenProps = {}) {
    const navigate = useNavigate();
    const accessToken = useStore((state) => state.accessToken);
    const idToken = useStore((state) => state.idToken);
    const resetAuthToken = useStore((state) => {
        return state.resetAuthToken;
    });
    const resetIctTokens = useStore((state) => {
        return state.resetIctTokens;
    });
    // const resetIctToken = useStore((state) => {
    //     return state.resetIctToken;
    // });
    // const ictTokens = useStore((state) => {
    //     return state.ictTokenSets;
    // });

    const signalingUrl = new URL(
        `${import.meta.env.VITE_SOCKET_URL || 'http://op.localhost'}`
    );
    signalingUrl.searchParams.append('oidc', accessToken);

    // Verifies that neither auth token nor any ict token is expired
    async function checkTokens() {
        if (!idToken) {
            return;
        }
        if (idToken.exp < Math.floor(Date.now()) / 1000) {
            // ? Comment for disabling token checking
            resetTokens();
        } else {
            // TODO Fix endless loop
            // // find bad ICT Access Token
            // const badICTTokens = ictTokens.filter((ictToken) => {
            //     return ictToken.idToken.exp < Math.floor(Date.now()) / 1000;
            // });
            // // Remove all bad ICT Access Token
            // badICTTokens.forEach((ictToken) => {
            //     console.log('clearing tokens');
            //     resetIctToken(ictToken.idToken.iss);
            // });
        }
    }

    function resetTokens() {
        resetAuthToken();
        resetIctTokens();
    }

    // * Check if Tokens are needed
    useEffect(() => {
        if (needsToken === undefined) {
            return;
        }
        if (needsToken && (!accessToken || !idToken)) {
            navigate('/login');
        }
        if (!needsToken && accessToken && idToken) {
            navigate('/call');
        }
    }, [accessToken, idToken, needsToken, navigate]);

    // * Check if Tokens are expired
    useEffect(() => {
        const timeout = setTimeout(checkTokens, 30000);
        checkTokens();
        return () => clearTimeout(timeout);
    });
    useEffect(() => {
        checkTokens();
    }, []);

    return {
        accessToken,
        idToken,
        signalingUrl,
        resetTokens,
    };
}
