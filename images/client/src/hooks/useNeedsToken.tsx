import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTokenStore } from '../stores/TokenZustand';

export function useNeedsToken(needsToken: boolean) {
    const navigate = useNavigate();
    const accessToken = useTokenStore((state) => state.accessToken);
    const idToken = useTokenStore((state) => state.idToken);

    useEffect(() => {
        if (needsToken && (!accessToken || !idToken)) {
            navigate('/auth/login');
        }
        if (!needsToken && accessToken && idToken) {
            navigate('/call');
        }
    }, [accessToken, idToken, needsToken, navigate]);
}
