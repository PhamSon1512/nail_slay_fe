import { useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { authTokenAtom, authUserAtom } from '~/utils/atoms';
import { clearAuth, logoutApi } from '~/utils/auth';

/** Clears API session, storage, and Jotai auth state. */
export function useLogout() {
  const setAuthUser = useSetAtom(authUserAtom);
  const setAuthToken = useSetAtom(authTokenAtom);

  return useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      clearAuth();
    }
    setAuthUser(null);
    setAuthToken(null);
  }, [setAuthToken, setAuthUser]);
}
