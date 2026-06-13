import { Link, useLocation } from 'react-router';
import { Button, Tooltip } from '@heroui/react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiBarChart2Line,
  RiBox3Line,
  RiGridLine,
  RiImageLine,
  RiOrderPlayLine,
  RiQrCodeLine,
  RiSettingsLine,
  RiUserLine,
} from 'react-icons/ri';
import { BRAND } from '~/data';
import { cn } from '~/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: RiBarChart2Line },
  { label: 'Banner', href: '/admin/banners', icon: RiImageLine },
  { label: 'Sản phẩm', href: '/admin/products', icon: RiBox3Line },
  { label: 'Danh mục', href: '/admin/categories', icon: RiGridLine },
  { label: 'Đơn hàng', href: '/admin/orders', icon: RiOrderPlayLine },
  { label: 'Người dùng', href: '/admin/users', icon: RiUserLine },
  { label: 'Thanh toán QR', href: '/admin/payment', icon: RiQrCodeLine },
  { label: 'Cài đặt trang chủ', href: '/admin/settings', icon: RiSettingsLine },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onToggle} aria-hidden />
      ) : null}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-[#1D1D1D] text-[#FFF3F5] z-30 transition-all duration-300 flex flex-col',
          isOpen ? 'w-60' : 'w-0 lg:w-16 overflow-hidden',
        )}
      >
        <div
          className={cn(
            'flex items-center gap-3 px-4 h-16 border-b border-[#2f2f2f] shrink-0',
            !isOpen && 'lg:justify-center lg:px-0',
          )}
        >
          <img
            src={BRAND.assets.logo}
            alt={BRAND.name}
            className="bg-white rounded-full border border-primary-500 !w-9 !h-9 shrink-0 object-contain p-0.5"
          />
          {isOpen ? (
            <span className="font-heading font-bold text-lg text-white whitespace-nowrap">
              {BRAND.name}
            </span>
          ) : null}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            const item = (
              <Link
                key={href}
                to={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  active
                    ? 'bg-primary-500/20 text-[#FFF3F5] border border-primary-400/30'
                    : 'text-[#FFDDE5] hover:bg-[#2b2b2b] hover:text-white',
                  !isOpen && 'lg:justify-center lg:px-0',
                )}
              >
                <Icon
                  size={20}
                  className={cn(
                    'shrink-0',
                    active ? 'text-primary-300' : 'text-[#8E8A8A] group-hover:text-white',
                  )}
                />
                {isOpen ? <span className="whitespace-nowrap">{label}</span> : null}
              </Link>
            );

            return isOpen ? (
              item
            ) : (
              <Tooltip key={href} content={label} placement="right">
                {item}
              </Tooltip>
            );
          })}
        </nav>

        <div className="shrink-0 px-2 pb-4 hidden lg:block">
          <Button
            isIconOnly={!isOpen}
            variant="flat"
            size="sm"
            onPress={onToggle}
            className={cn(
              'text-[#FFDDE5] hover:text-white bg-[#2b2b2b]',
              isOpen ? 'w-full justify-center' : 'w-full',
            )}
            aria-label={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
            startContent={isOpen ? <RiArrowLeftSLine size={18} /> : undefined}
          >
            {isOpen ? (
              <span className="text-xs font-medium">Thu gọn</span>
            ) : (
              <RiArrowRightSLine size={18} />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
