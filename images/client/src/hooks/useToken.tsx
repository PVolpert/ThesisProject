import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../stores/ZustandStore';

interface useTokenProps {
    needsToken: boolean;
}

export function useToken({ needsToken }: useTokenProps) {
    const navigate = useNavigate();
    const accessToken = useStore((state) => state.accessToken);
    const idToken = useStore((state) => state.idToken);
    const reset = useStore((state) => {
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
