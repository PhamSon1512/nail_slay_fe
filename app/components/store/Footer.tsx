import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  RiFacebookFill,
  RiTwitterFill,
  RiMailFill,
  RiPinterestFill,
  RiLinkedinFill,
} from 'react-icons/ri';
import { BRAND } from '~/data';
import { fetchPublicSettings } from '~/utils/api/settings';
import { FloatingSocialButtons } from './FloatingSocialButtons';

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

  return (
    <footer className="bg-[#1D1D1D] text-[#FFF3F5] mt-20 border-t border-primary-200/10">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: BRAND INFORMATION */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-base tracking-wider uppercase">
              {BRAND.name.toUpperCase()}
            </h3>
            <div className="w-12 border-b-2 border-primary-300"></div>
            
            <div className="pt-2">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white flex items-center justify-center p-2 shadow-md border border-primary-200/20 mb-4">
                <img
                  src={BRAND.assets.logo}
                  alt={BRAND.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-[#FFDDE5] leading-relaxed">
              <p className="flex items-start gap-1">
                <span className="font-medium shrink-0">Địa chỉ:</span>
                <span>{contact.address}</span>
              </p>
              <p className="flex items-center gap-1">
                <span className="font-medium shrink-0">Hotline:</span>
                <a href={`tel:${contact.phone}`} className="hover:text-primary-300 transition-colors">
                  {contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-1">
                <span className="font-medium shrink-0">Email:</span>
                <a href={`mailto:${contact.email}`} className="hover:text-primary-300 transition-colors break-all">
                  {contact.email}
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: CATEGORIES (DANH MỤC) */}
          <div>
            <h3 className="font-heading font-bold text-white text-base tracking-wider uppercase">
              Danh mục
            </h3>
            <div className="w-12 border-b-2 border-primary-300 mb-6"></div>
            
            <ul className="space-y-3">
              {[
                { label: 'Giới thiệu', href: '/gioi-thieu' },
                { label: 'Sản phẩm', href: '/san-pham' },
                { label: 'Bài viết', href: '/bai-viet' },
                { label: 'Liên hệ', href: '/lien-he' },
              ].map((link) => (
                <li key={link.label} className="flex items-center">
                  <span className="text-[#F2A7B7] mr-2 font-bold text-xs">&gt;</span>
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

          {/* Column 3: POLICIES (CHÍNH SÁCH) */}
          <div>
            <h3 className="font-heading font-bold text-white text-base tracking-wider uppercase">
              Chính sách
            </h3>
            <div className="w-12 border-b-2 border-primary-300 mb-6"></div>
            
            <ul className="space-y-3">
              {[
                { label: 'Chính sách bảo mật', href: '/chinh-sach' },
                { label: 'Chính sách bảo hành', href: '/chinh-sach' },
                { label: 'Chính sách vận chuyển', href: '/chinh-sach' },
                { label: 'Chính sách đổi trả', href: '/chinh-sach' },
              ].map((link) => (
                <li key={link.label} className="flex items-center">
                  <span className="text-[#F2A7B7] mr-2 font-bold text-xs">&gt;</span>
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

          {/* Column 4: CONNECT WITH US (KẾT NỐI VỚI CHÚNG TÔI) */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white text-base tracking-wider uppercase">
              Kết nối với chúng tôi
            </h3>
            <div className="w-12 border-b-2 border-primary-300 mb-6"></div>
            
            {/* Facebook Page Widget Mockup */}
            <div className="bg-[#181818] border border-primary-200/10 rounded-lg p-4 flex flex-col gap-3 max-w-[280px] shadow-sm">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-white rounded border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={BRAND.assets.logo} alt={BRAND.name} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <a
                    href={contactInfo?.footer_facebook || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:underline text-xs block truncate"
                  >
                    {BRAND.name}
                  </a>
                  <span className="text-[10px] text-[#8E8A8A] block">121 người theo dõi</span>
                </div>
              </div>
              <a
                href={contactInfo?.footer_facebook || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#2b4170] hover:bg-[#3b5998] text-white text-[11px] font-semibold py-1 px-2.5 rounded flex items-center justify-center gap-1.5 transition-colors w-fit shadow-sm"
              >
                <RiFacebookFill size={12} />
                Theo dõi Trang
              </a>
            </div>

            {/* Circular Social Buttons */}
            <div className="flex gap-2.5 pt-2">
              {[
                { label: 'Facebook', href: contactInfo?.footer_facebook || '#', icon: RiFacebookFill, bg: 'bg-[#3b5998]' },
                { label: 'Twitter', href: '#', icon: RiTwitterFill, bg: 'bg-[#1da1f2]' },
                { label: 'Mail', href: `mailto:${contact.email}`, icon: RiMailFill, bg: 'bg-[#222222]' },
                { label: 'Pinterest', href: '#', icon: RiPinterestFill, bg: 'bg-[#bd081c]' },
                { label: 'LinkedIn', href: '#', icon: RiLinkedinFill, bg: 'bg-[#0a66c2]' },
              ].map(({ label, href, icon: Icon, bg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-full ${bg} hover:opacity-80 flex items-center justify-center transition-opacity text-white shadow-sm`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-200/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#FFDDE5]/80">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-xs text-[#F2A7B7]">{BRAND.slogan}</p>
          <p className="text-xs text-[#FFDDE5]/70">
            Thiết kế với tinh thần premium feminine
          </p>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <FloatingSocialButtons contactInfo={contactInfo || undefined} />
    </footer>
  );
}
