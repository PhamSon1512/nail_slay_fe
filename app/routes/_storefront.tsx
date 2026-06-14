import { Outlet } from 'react-router';
import { Footer, Navbar } from '~/components';
import { ServerCartBootstrap } from '~/components/store/ServerCartBootstrap';

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-brand-bg)] dark:bg-[#1d1d1d]">
      <ServerCartBootstrap />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
