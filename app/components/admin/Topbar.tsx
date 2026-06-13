import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { useAtom } from 'jotai';
import { RiBellLine, RiExternalLinkLine, RiLogoutBoxLine, RiMenuLine } from 'react-icons/ri';
import { Link } from 'react-router';
import { BRAND } from '~/data';
import { authUserAtom } from '~/utils/atoms';

interface TopbarProps {
  onMenuToggle: () => void;
}

export function Topbar({ onMenuToggle }: TopbarProps) {
  const [authUser] = useAtom(authUserAtom);

  const displayName = authUser?.fullName ?? authUser?.email ?? 'Admin';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="site-header h-16 flex items-center justify-between px-4 gap-4 sticky top-0 z-10 supports-[backdrop-filter]:bg-white/92 dark:supports-[backdrop-filter]:bg-[#2a2226]/92">
      <Button
        isIconOnly
        variant="light"
        size="sm"
        onPress={onMenuToggle}
        className="lg:hidden text-[#8E8A8A]"
        aria-label="Toggle menu"
      >
        <RiMenuLine size={20} />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Link to="/" className="hidden md:flex items-center gap-2 group">
          <img
            src={BRAND.assets.logo}
            alt={BRAND.name}
            className="brand-logo-ring !w-9 !h-9 transition-transform group-hover:scale-105"
          />
        </Link>

        <Button
          as={Link}
          to="/"
          size="sm"
          variant="light"
          startContent={<RiExternalLinkLine size={14} />}
          className="hidden sm:flex text-[#8E8A8A] dark:text-[#FFDDE5] text-xs"
        >
          Xem cửa hàng
        </Button>

        <Button
          isIconOnly
          variant="light"
          size="sm"
          aria-label="Thông báo"
          className="text-[#8E8A8A] dark:text-[#FFDDE5]"
        >
          <RiBellLine size={18} />
        </Button>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              name={initials}
              size="sm"
              classNames={{
                base: 'bg-gradient-to-br from-primary-400 to-primary-600 cursor-pointer',
                name: 'text-[#1D1D1D] font-semibold text-xs',
              }}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Admin menu" classNames={{ base: 'bg-white dark:bg-[#2a2226]' }}>
            <DropdownItem key="name" isReadOnly className="opacity-70 text-xs text-[#1D1D1D] dark:text-[#FFF3F5]">
              {displayName}
            </DropdownItem>
            <DropdownItem key="logout" color="danger" startContent={<RiLogoutBoxLine size={14} />}>
              Đăng xuất
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
