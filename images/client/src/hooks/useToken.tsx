import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenStore } from '../stores/TokenZustand';

interface useTokenProps {
    needsToken: boolean;
}

export function useToken({ needsToken }: useTokenProps) {
    const navigate = useNavigate();
    const accessToken = useTokenStore((state) => state.accessToken);
    const idToken = useTokenStore((state) => state.idToken);
    const reset = useTokenStore((state) => {
        return state.reset;
    });

    useEffect(() => {
        if (needsToken && (!accessToken || !idToken)) {
            navigate('/auth/login');
        }
        if (!needsToken && accessToken && idToken) {
            navigate('/call');
        }
    }, [accessToken, idToken, needsToken, navigate]);

    useEffect(() => {
        if (!idToken) {
            return;
        }
        if (idToken.exp < Math.floor(Date.now()) / 1000) {
            reset();
        }
    });

    return {
        accessToken,
        idToken,
    };
}
