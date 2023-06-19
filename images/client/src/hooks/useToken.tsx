import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useZustandStore } from '../stores/zustand/ZustandStore';

interface useTokenProps {
    needsToken?: boolean;
}

export function useToken({ needsToken = undefined }: useTokenProps = {}) {
    const navigate = useNavigate();
    const accessToken = useZustandStore((state) => state.accessToken);
    const idToken = useZustandStore((state) => state.idToken);
    const resetAuthToken = useZustandStore((state) => {
        return state.resetAuthToken;
    });
    const resetIctTokens = useZustandStore((state) => {
        return state.resetIctTokens;
    });
    const resetIctToken = useZustandStore((state) => {
        return state.resetIctToken;
    });
    const ictTokens = useZustandStore((state) => {
        return state.ictTokens;
    });

    const signalingUrl = new URL(`${process.env.REACT_APP_SOCKET_URL}`);
    signalingUrl.searchParams.append('oidc', accessToken);

    // * Check if Tokens are needed
    useEffect(() => {
        if (needsToken === undefined) {
            return;
        }
        if (needsToken && (!accessToken || !idToken)) {
            navigate('/auth/login');
        }
        if (!needsToken && accessToken && idToken) {
            navigate('/call');
        }
    }, [accessToken, idToken, needsToken, navigate]);

    async function checkTokens() {
        if (!idToken) {
            return;
        }
        if (idToken.exp < Math.floor(Date.now()) / 1000) {
            resetAuthToken();
            resetIctTokens();
        } else {
            // find bad ICTs
            const badICTTokens = ictTokens.filter((ictToken) => {
                return ictToken.idToken.exp < Math.floor(Date.now()) / 1000;
            });
            // Remove all bad ICTs
            badICTTokens.forEach((ictToken) => {
                resetIctToken(ictToken.idToken.iss);
            });
        }
    }

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
    };
}
