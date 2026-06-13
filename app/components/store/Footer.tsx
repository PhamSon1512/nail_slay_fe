import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  RiFacebookFill,
  RiInstagramLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiTiktokFill,
} from 'react-icons/ri';
import { BRAND, CATEGORIES } from '~/data';
import { fetchPublicSettings } from '~/utils/api/settings';

const LINKS = {
  shop: CATEGORIES.filter((c) => c.level === 'child').map((c) => ({
    label: `${c.code} - ${c.name}`,
    href: `/products?category=${c.code}`,
  })),
  info: [
    { label: 'Về NailSlay', href: '/about' },
    { label: 'Blog làm nail', href: '/#' },
    { label: 'Chính sách đổi trả', href: '/policy' },
    { label: 'Hướng dẫn mua hàng', href: '/guide' },
  ],
};

export function Footer() {
  const [contactInfo, setContactInfo] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    fetchPublicSettings()
      .then((data) => setContactInfo(data.contact_info))
      .catch(() => undefined);
  }, []);

  const contact = useMemo(
    () => ({
      address: contactInfo?.address || BRAND.contact.address,
      phone: contactInfo?.phone || BRAND.contact.phone,
      email: contactInfo?.email || BRAND.contact.email,
    }),
    [contactInfo],
  );

  const socials = useMemo(
    () => [
      { label: 'Facebook', href: contactInfo?.facebook || '#', icon: RiFacebookFill },
      { label: 'Instagram', href: '#', icon: RiInstagramLine },
      { label: 'TikTok', href: contactInfo?.tiktok || '#', icon: RiTiktokFill },
    ],
    [contactInfo],
  );

  return (
    <footer className="bg-[#1D1D1D] text-[#FFF3F5] mt-20">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 shrink-0">
                <img
                  src={BRAND.assets.logo}
                  alt={BRAND.name}
                  className="brand-logo-ring relative z-10 w-full h-full object-contain bg-white"
                />
              </div>
              <span className="font-heading text-xl font-bold text-white">{BRAND.name}</span>
            </Link>
            <p className="text-xs text-[#FFDDE5] uppercase tracking-[0.2em]">{BRAND.slogan}</p>
            <p className="text-sm text-[#FFDDE5] leading-relaxed">
              Nail box thiết kế theo phong cách riêng cho bạn. Màu sắc sang trọng, chất liệu an
              toàn và dễ sử dụng tại nhà.
            </p>
            <div className="flex gap-3 pt-1">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-[#2d2d2d] hover:bg-[#F2A7B7] flex items-center justify-center transition-colors text-[#FFDDE5] hover:text-[#1D1D1D]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Sản phẩm
            </h3>
            <ul className="space-y-2.5">
              {LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#FFDDE5] hover:text-[#F2A7B7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Thông tin
            </h3>
            <ul className="space-y-2.5">
              {LINKS.info.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#FFDDE5] hover:text-[#F2A7B7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Liên hệ
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-[#FFDDE5]">
                <RiMapPinLine size={16} className="mt-0.5 text-[#F2A7B7] shrink-0" />
                <span>{contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <RiPhoneLine size={16} className="text-[#F2A7B7] shrink-0" />
                <a href={`tel:${contact.phone}`} className="text-[#FFDDE5] hover:text-[#F2A7B7] transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <RiMailLine size={16} className="text-[#F2A7B7] shrink-0" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[#FFDDE5] hover:text-[#F2A7B7] transition-colors"
                >
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#3a3a3a]">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#FFDDE5]/80">
            © {new Date().getFullYear()} NailSlay. All rights reserved.
          </p>
          <p className="text-xs text-[#F2A7B7]">{BRAND.slogan}</p>
          <p className="text-xs text-[#FFDDE5]/70">
            Thiết kế với tinh thần premium feminine
          </p>
        </div>
      </div>
    </footer>
  );
}
