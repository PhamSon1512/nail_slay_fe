import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useAtomValue } from 'jotai';
import { clearAuth, getProfileApi, readStoredToken, refreshSessionApi } from '~/utils/auth';
import { authBootstrapReadyAtom, authTokenAtom, authUserAtom } from '~/utils/atoms';

function getHttpStatus(error: unknown): number | undefined {
  return (error as { response?: { status?: number } } | undefined)?.response?.status;
}

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
        clearAuth();
        if (!cancelled) {
          setAuthUser(null);
          setAuthToken(null);
          setBootstrapReady(true);
        }
        return;
      }

      setAuthToken(token);

      try {
        const profile = await getProfileApi();
        if (!cancelled) setAuthUser(profile);
      } catch (e) {
        const status = getHttpStatus(e);

        if (status === 401 || status === 403) {
          try {
            const { token: newToken, user } = await refreshSessionApi();
            if (!cancelled) {
              setAuthToken(newToken);
              setAuthUser(user);
            }
            return;
          } catch {
            clearAuth();
            if (!cancelled) {
              setAuthUser(null);
              setAuthToken(null);
            }
            return;
          }
        }

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
