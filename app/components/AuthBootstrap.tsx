import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSetAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { clearAuth, getProfileApi } from '~/utils/auth';
import { authBootstrapReadyAtom, authTokenAtom, authUserAtom } from '~/utils/atoms';

/** Khôi phục phiên đăng nhập từ cookie/localStorage và xác thực với API. */
export function AuthBootstrap() {
  const setAuthUser = useSetAtom(authUserAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setBootstrapReady = useSetAtom(authBootstrapReadyAtom);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = Cookies.get('token') || localStorage.getItem('nailslay_token');

      if (!token) {
        if (!cancelled) setBootstrapReady(true);
        return;
      }

      setAuthToken(token);

      try {
        const profile = await getProfileApi();
        if (!cancelled) setAuthUser(profile);
      } catch {
        clearAuth();
        if (!cancelled) {
          setAuthUser(null);
          setAuthToken(null);
        }
      } finally {
        if (!cancelled) setBootstrapReady(true);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setAuthToken, setAuthUser, setBootstrapReady]);

  return null;
}

export function useAuthReady() {
  return useAtomValue(authBootstrapReadyAtom);
}
