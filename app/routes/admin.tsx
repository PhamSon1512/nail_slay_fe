import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { Sidebar, Topbar } from '~/components';
import { useAtomValue } from 'jotai';
import { useAuthReady } from '~/components/AuthBootstrap';
import { isAdminRole } from '~/utils/auth';
import { authUserAtom } from '~/utils/atoms';
import { cn } from '~/utils';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const authUser = useAtomValue(authUserAtom);
  const authReady = useAuthReady();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authReady) return;

    if (!authUser) {
      toast.error('Vui lòng đăng nhập tài khoản quản trị');
      navigate('/login?redirect=/admin/dashboard', { replace: true });
      return;
    }

    if (!isAdminRole(authUser.role)) {
      toast.error('Bạn không có quyền truy cập khu vực quản trị');
      navigate('/', { replace: true });
    }
  }, [authReady, authUser, navigate]);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--color-brand-bg)]">
        <p className="text-sm text-[#8E8A8A]">Đang xác thực phiên đăng nhập...</p>
      </div>
    );
  }

  if (!authUser || !isAdminRole(authUser.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-brand-bg)] dark:bg-[#1d1d1d] flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300',
          sidebarOpen ? 'lg:ml-60' : 'lg:ml-16',
        )}
      >
        <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
