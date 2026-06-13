import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as HeroNavbar,
} from '@heroui/react';
import { useAtom } from 'jotai';
import { RiMoonLine, RiShoppingBag3Line, RiSunLine, RiUserLine } from 'react-icons/ri';
import { useAuthReady } from '~/components/AuthBootstrap';
import { BRAND } from '~/data';
import { clearAuth, isAdminRole, logoutApi } from '~/utils/auth';
import { authUserAtom, cartCountAtom, darkModeAtom } from '~/utils/atoms';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Sản phẩm', href: '/products' },
  { label: 'Danh mục', href: '/categories' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const authReady = useAuthReady();
  const [cartCount] = useAtom(cartCountAtom);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      clearAuth();
    }
    setAuthUser(null);
    navigate('/');
  };

  const handleMenuAction = (key: React.Key) => {
    switch (key) {
      case 'profile':
        navigate('/profile');
        break;
      case 'password':
        navigate('/change-password');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'logout':
        void handleLogout();
        break;
      default:
        break;
    }
  };

  const displayName =
    authUser?.fullName?.split(' ').filter(Boolean).pop() ??
    authUser?.email?.split('@')[0] ??
    'Tài khoản';

  return (
    <HeroNavbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll={false}
      isBlurred={isScrolled}
      className="site-header backdrop-blur-md supports-[backdrop-filter]:bg-white/92 dark:supports-[backdrop-filter]:bg-[#2a2226]/92"
      maxWidth="full"
      height="5.5rem"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'} />
      </NavbarContent>

      <NavbarBrand className="gap-3">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={BRAND.assets.logo}
            alt={BRAND.name}
            className="brand-logo-ring transition-transform duration-300 group-hover:scale-105"
          />
          <span className="brand-name text-xl md:text-2xl lg:text-3xl hidden sm:block">
            {BRAND.name}
          </span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-1 flex-1 justify-center" justify="center">
        {NAV_LINKS.map((link) => (
          <NavbarItem key={link.href} isActive={isActive(link.href)}>
            <Link
              to={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-[#1D1D1D] bg-primary-200/60 dark:text-[#FFF3F5] dark:bg-primary-700/40'
                  : 'text-[#8E8A8A] hover:text-[#1D1D1D] dark:text-[#FFDDE5] dark:hover:text-[#FFF3F5]'
              }`}
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            aria-label="Chế độ sáng/tối"
            onPress={() => setDarkMode(!darkMode)}
            className="text-[#8E8A8A] dark:text-[#FFDDE5]"
          >
            {darkMode ? <RiSunLine size={18} /> : <RiMoonLine size={18} />}
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Link to="/cart">
            <Badge
              content={cartCount > 0 ? cartCount : undefined}
              color="primary"
              size="sm"
              showOutline={false}
            >
              <Button
                variant="flat"
                color="primary"
                size="sm"
                startContent={<RiShoppingBag3Line size={18} />}
                className="font-semibold text-[#1D1D1D] hidden sm:flex"
              >
                Giỏ hàng
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                aria-label="Giỏ hàng"
                className="text-[#1D1D1D] dark:text-[#FFF3F5] sm:hidden"
              >
                <RiShoppingBag3Line size={20} />
              </Button>
            </Badge>
          </Link>
        </NavbarItem>

        <NavbarItem>
          {authReady && authUser ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="flat"
                  color="primary"
                  size="sm"
                  startContent={<RiUserLine size={16} />}
                  className="font-medium text-[#1D1D1D]"
                >
                  {displayName}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Menu tài khoản" onAction={handleMenuAction}>
                <DropdownItem key="profile">Thông tin tài khoản</DropdownItem>
                <DropdownItem key="password">Đổi mật khẩu</DropdownItem>
                {isAdminRole(authUser.role) ? (
                  <DropdownItem key="admin">Quản trị</DropdownItem>
                ) : null}
                <DropdownItem key="logout" className="text-danger" color="danger">
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : authReady ? (
            <Button
              as={Link}
              to="/login"
              color="primary"
              size="sm"
              variant="flat"
              startContent={<RiUserLine size={16} />}
              className="font-medium text-[#1D1D1D]"
            >
              Đăng nhập
            </Button>
          ) : null}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pt-4 gap-1 bg-[color:var(--color-brand-header)] dark:bg-[color:var(--color-brand-header-dark)]">
        {NAV_LINKS.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link
              to={link.href}
              className={`block w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-[#1D1D1D] bg-primary-100 dark:text-[#FFF3F5] dark:bg-primary-700/40'
                  : 'text-[#1D1D1D] dark:text-[#FFDDE5]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}
        {authUser && isAdminRole(authUser.role) ? (
          <NavbarMenuItem>
            <Link
              to="/admin/dashboard"
              className="block w-full px-4 py-2.5 rounded-xl text-sm font-medium text-[#1D1D1D] dark:text-[#FFDDE5]"
              onClick={() => setIsMenuOpen(false)}
            >
              Quản trị
            </Link>
          </NavbarMenuItem>
        ) : null}
      </NavbarMenu>
    </HeroNavbar>
  );
}
