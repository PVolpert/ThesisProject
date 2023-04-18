import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useZustandStore } from '../stores/zustand/ZustandStore';

interface useTokenProps {
    needsToken: boolean;
}

export function useToken({ needsToken }: useTokenProps) {
    const navigate = useNavigate();
    const accessToken = useZustandStore((state) => state.accessToken);
    const idToken = useZustandStore((state) => state.idToken);
    const resetAuth = useZustandStore((state) => {
        return state.resetAuth;
    });
    const resetICTs = useZustandStore((state) => {
        return state.resetICTs;
    });

    // * Check if Tokens are needed
    useEffect(() => {
        if (needsToken && (!accessToken || !idToken)) {
            navigate('/auth/login');
        }
        if (!needsToken && accessToken && idToken) {
            navigate('/call');
        }
    }, [accessToken, idToken, needsToken, navigate]);

    // * Check if Tokens are expired
    useEffect(() => {
        if (!idToken) {
            return;
        }
        if (idToken.exp < Math.floor(Date.now()) / 1000) {
            resetAuth();
            resetICTs();
        }
    });

    return {
        accessToken,
        idToken,
    };
}
