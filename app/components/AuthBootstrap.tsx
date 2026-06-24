import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { clearAuth, getProfileApi, readStoredToken } from '~/utils/auth';
import { authBootstrapReadyAtom, authTokenAtom, authUserAtom } from '~/utils/atoms';

/** Khôi phục phiên đăng nhập từ cookie/localStorage và xác thực với API. */
export function AuthBootstrap() {
  const setAuthUser = useSetAtom(authUserAtom);
  const setAuthToken = useSetAtom(authTokenAtom);
  const setBootstrapReady = useSetAtom(authBootstrapReadyAtom);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const token = readStoredToken();

      if (!token) {
        if (!cancelled) setBootstrapReady(true);
        return;
      }

      setAuthToken(token);

      try {
        const profile = await getProfileApi();
        if (!cancelled) setAuthUser(profile);
      } catch (e) {
        // Some environments might not expose profile endpoints yet (404).
        // In that case, keep local session to avoid breaking admin login UX.
        const status = (e as { response?: { status?: number } } | undefined)?.response?.status;
        if (status === 404) {
          try {
            const cached = localStorage.getItem('nailslay_user');
            if (cached && !cancelled) setAuthUser(JSON.parse(cached));
          } catch {
            // ignore
          }
          return;
        }

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
