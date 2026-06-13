import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { authUserAtom } from '~/utils/atoms';

export function useRequireAuth(redirectTo = '/login') {
  const authUser = useAtomValue(authUserAtom);
  const navigate = useNavigate();

  const requireAuth = (action?: () => void) => {
    if (!authUser) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate(`${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    action?.();
    return true;
  };

  return { authUser, requireAuth, isLoggedIn: !!authUser };
}
