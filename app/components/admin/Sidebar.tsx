import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Button, Tooltip } from '@heroui/react';
import {
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpSLine,
  RiArticleLine,
  RiBarChart2Line,
  RiBox3Line,
  RiExternalLinkLine,
  RiGridLine,
  RiImageLine,
  RiOrderPlayLine,
  RiQrCodeLine,
  RiSearchLine,
  RiSettingsLine,
  RiUserLine,
} from 'react-icons/ri';
import { BRAND } from '~/data';
import { cn } from '~/utils';

type NavChild = { label: string; href: string; icon?: typeof RiArticleLine; external?: boolean };
type NavItem =
  | { type: 'link'; label: string; href: string; icon: typeof RiArticleLine }
  | { type: 'group'; id: string; label: string; icon: typeof RiArticleLine; children: NavChild[] };

const NAV_ITEMS: NavItem[] = [
  { type: 'link', label: 'Dashboard', href: '/admin/dashboard', icon: RiBarChart2Line },
  { type: 'link', label: 'Banner', href: '/admin/banners', icon: RiImageLine },
  { type: 'link', label: 'Sản phẩm', href: '/admin/products', icon: RiBox3Line },
  {
    type: 'group',
    id: 'articles-seo',
    label: 'Bài viết - SEO',
    icon: RiArticleLine,
    children: [
      { label: 'Bài viết', href: '/admin/articles', icon: RiArticleLine },
      { label: 'Danh mục Bài viết', href: '/admin/articles/categories', icon: RiGridLine },
      { label: '404 Monitor', href: '/admin/seo/404', icon: RiSearchLine },
      { label: 'Redirects', href: '/admin/seo/redirects', icon: RiSearchLine },
      { label: 'SEO & Tracking', href: '/admin/settings/tracking', icon: RiSettingsLine },
      { label: 'Sitemap', href: 'https://nailslaystudio.com/sitemap.xml', icon: RiExternalLinkLine, external: true },
    ],
  },
  { type: 'link', label: 'Danh mục', href: '/admin/categories', icon: RiGridLine },
  { type: 'link', label: 'Đơn hàng', href: '/admin/orders', icon: RiOrderPlayLine },
  { type: 'link', label: 'Khiếu nại', href: '/admin/complaints', icon: RiAlertLine },
  { type: 'link', label: 'Người dùng', href: '/admin/users', icon: RiUserLine },
  { type: 'link', label: 'Thanh toán QR', href: '/admin/payment', icon: RiQrCodeLine },
  { type: 'link', label: 'Cài đặt trang chủ', href: '/admin/settings', icon: RiSettingsLine },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'articles-seo': true });

  const isActive = (href: string) =>
    location.pathname === href ||
    (href === '/admin/articles' && location.pathname.startsWith('/admin/articles')) ||
    location.pathname.startsWith(href + '/');

  const groupHasActive = (children: NavChild[]) => children.some((c) => !c.external && isActive(c.href));

  useEffect(() => {
    NAV_ITEMS.forEach((item) => {
      if (item.type === 'group' && groupHasActive(item.children)) {
        setExpanded((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [location.pathname]);

  const renderLink = (label: string, href: string, Icon: typeof RiArticleLine, active: boolean, external?: boolean) => {
    const className = cn(
      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
      active
        ? 'bg-primary-500/20 text-[#FFF3F5] border border-primary-400/30'
        : 'text-[#FFDDE5] hover:bg-[#2b2b2b] hover:text-white',
      !isOpen && 'lg:justify-center lg:px-0',
    );

    const content = (
      <>
        <Icon
          size={18}
          className={cn('shrink-0', active ? 'text-primary-300' : 'text-[#8E8A8A] group-hover:text-white')}
        />
        {isOpen ? <span className="whitespace-nowrap">{label}</span> : null}
      </>
    );

    if (external) {
      return (
        <a key={href} href={href} target="_blank" rel="noreferrer" className={className}>
          {content}
        </a>
      );
    }

    return (
      <Link key={href} to={href} className={className}>
        {content}
      </Link>
    );
  };

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
          <Link
            to="/admin/dashboard"
            className={cn(
              'flex items-center gap-3 group',
              isOpen ? 'w-full' : 'lg:w-full lg:justify-center',
            )}
          >
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary-500 rounded-full blur-[6px] opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
              <img
                src={BRAND.assets.logo}
                alt={BRAND.name}
                className="bg-white rounded-full border-2 border-primary-400 !w-10 !h-10 relative z-10 object-contain p-0.5 transition-transform duration-300 group-hover:scale-110 shadow-md shadow-black/50"
              />
            </div>
            {isOpen ? (
              <span className="font-heading font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-white whitespace-nowrap tracking-wide group-hover:from-primary-300 group-hover:to-primary-100 transition-all duration-300">
                {BRAND.name}
              </span>
            ) : null}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
          {NAV_ITEMS.map((item) => {
            if (item.type === 'link') {
              const active = isActive(item.href);
              const link = renderLink(item.label, item.href, item.icon, active);
              return isOpen ? link : (
                <Tooltip key={item.href} content={item.label} placement="right">
                  {link}
                </Tooltip>
              );
            }

            const groupActive = groupHasActive(item.children);
            const isExpanded = expanded[item.id] ?? false;

            if (!isOpen) {
              const firstChild = item.children[0];
              return (
                <Tooltip key={item.id} content={item.label} placement="right">
                  {renderLink(item.label, firstChild.href, item.icon, groupActive)}
                </Tooltip>
              );
            }

            return (
              <div key={item.id} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [item.id]: !isExpanded }))}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    groupActive
                      ? 'bg-primary-500/10 text-[#FFF3F5] border border-primary-400/20'
                      : 'text-[#FFDDE5] hover:bg-[#2b2b2b] hover:text-white',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon size={20} className={groupActive ? 'text-primary-300' : 'text-[#8E8A8A]'} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </span>
                  {isExpanded ? <RiArrowUpSLine size={16} /> : <RiArrowDownSLine size={16} />}
                </button>
                {isExpanded ? (
                  <div className="ml-3 border-l border-[#3a3a3a] pl-2 space-y-0.5">
                    {item.children.map((child) => {
                      const Icon = child.icon ?? RiArticleLine;
                      const active = !child.external && isActive(child.href);
                      return renderLink(child.label, child.href, Icon, active, child.external);
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 px-2 pb-4 hidden lg:block">
          <Button
            isIconOnly={!isOpen}
            variant="flat"
            size="sm"
            onPress={onToggle}
            className={cn('text-[#FFDDE5] hover:text-white bg-[#2b2b2b]', isOpen ? 'w-full justify-center' : 'w-full')}
            aria-label={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
            startContent={isOpen ? <RiArrowLeftSLine size={18} /> : undefined}
          >
            {isOpen ? <span className="text-xs font-medium">Thu gọn</span> : <RiArrowRightSLine size={18} />}
          </Button>
        </div>
      </aside>
    </>
  );
}
