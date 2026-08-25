import type { Route } from './+types/_storefront.lien-he';
import { useEffect, useMemo, useState } from 'react';
import { Button, Input } from '@heroui/react';
import { RiMapPinLine, RiTimeLine, RiMailLine, RiPhoneLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { BRAND } from '~/data';
import { fetchPublicSettings } from '~/utils/api/settings';

export const handle = { pageTitle: 'Liên hệ' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Liên hệ - Nailslay' }];

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<Record<string, string> | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Giả lập gửi thông tin liên hệ thành công
    setTimeout(() => {
      toast.success('Thông tin liên hệ của bạn đã được gửi thành công!');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[color:var(--color-brand-bg)] dark:bg-[#1d1d1d]">
      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-primary-100/30 via-white/20 to-primary-100/30 py-20 text-center relative overflow-hidden border-b border-primary-200/10">
        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-[#1D1D1D] dark:text-white tracking-wide">
            LIÊN HỆ
          </h1>
          <p className="text-sm md:text-base text-[#8E8A8A] dark:text-[#FFDDE5] max-w-xl mx-auto leading-relaxed">
            Nailslay luôn sẵn sàng lắng nghe mọi ý kiến đóng góp và giải đáp mọi thắc mắc của bạn 24/7.
          </p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container max-w-6xl py-16 px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Commitment & Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-[#B2706E] tracking-wider uppercase">
              CAM KẾT
            </h2>
            <div className="w-12 border-b-2 border-primary-300 mt-2"></div>
          </div>
          
          <p className="text-sm md:text-base text-[#5A5A5A] dark:text-[#FFDDE5] leading-relaxed">
            {BRAND.name} cam kết luôn hoạt động 24/7 để lắng nghe những thắc mắc của khách hàng về dịch vụ và sản phẩm của shop. Hãy liên hệ với chúng mình nếu bạn cần hỗ trợ nha.
          </p>
          
          <div className="space-y-6 pt-4">
            {/* Address */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-[#B2706E] shrink-0 shadow-sm border border-primary-200/20">
                <RiMapPinLine size={20} />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1D1D1D] dark:text-white">ĐỊA CHỈ</h3>
                <p className="text-sm text-[#5A5A5A] dark:text-[#FFDDE5] mt-0.5">{contact.address}</p>
              </div>
            </div>
            
            {/* Hours */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-[#B2706E] shrink-0 shadow-sm border border-primary-200/20">
                <RiTimeLine size={20} />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1D1D1D] dark:text-white">GIỜ MỞ CỬA</h3>
                <p className="text-sm text-[#5A5A5A] dark:text-[#FFDDE5] mt-0.5">Từ 7:00 đến 20:00 hằng ngày</p>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-[#B2706E] shrink-0 shadow-sm border border-primary-200/20">
                <RiMailLine size={20} />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1D1D1D] dark:text-white">EMAIL</h3>
                <a href={`mailto:${contact.email}`} className="text-sm text-[#B2706E] hover:underline mt-0.5 block break-all">{contact.email}</a>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-[#B2706E] shrink-0 shadow-sm border border-primary-200/20">
                <RiPhoneLine size={20} />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#1D1D1D] dark:text-white">HOTLINE</h3>
                <a href={`tel:${contact.phone}`} className="text-sm text-[#B2706E] hover:underline mt-0.5 block">{contact.phone}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-white/60 dark:bg-[#2a2226]/60 backdrop-blur-sm border border-primary-200/30 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-[#1D1D1D] dark:text-white">
              THÔNG TIN LIÊN HỆ
            </h2>
            <p className="text-xs text-[#8E8A8A] dark:text-[#FFDDE5] mt-1">Gửi thắc mắc hoặc câu hỏi cho chúng mình tại đây.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1D1D] dark:text-[#FFDDE5]">Tên của bạn</label>
              <Input
                value={form.name}
                onValueChange={(val) => setForm({ ...form, name: val })}
                placeholder="Nhập tên của bạn"
                required
                variant="bordered"
                classNames={{ inputWrapper: 'border-primary-200/60 bg-white/80 dark:bg-[#1a1518]/80' }}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1D1D] dark:text-[#FFDDE5]">Email của bạn</label>
              <Input
                type="email"
                value={form.email}
                onValueChange={(val) => setForm({ ...form, email: val })}
                placeholder="Nhập email của bạn"
                required
                variant="bordered"
                classNames={{ inputWrapper: 'border-primary-200/60 bg-white/80 dark:bg-[#1a1518]/80' }}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1D1D] dark:text-[#FFDDE5]">Tiêu đề</label>
              <Input
                value={form.subject}
                onValueChange={(val) => setForm({ ...form, subject: val })}
                placeholder="Nhập tiêu đề tin nhắn"
                required
                variant="bordered"
                classNames={{ inputWrapper: 'border-primary-200/60 bg-white/80 dark:bg-[#1a1518]/80' }}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1D1D1D] dark:text-[#FFDDE5]">Tin nhắn của bạn (không bắt buộc)</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Nhập nội dung tin nhắn..."
                rows={4}
                className="w-full text-sm px-3 py-2 border-2 border-primary-200/60 rounded-xl bg-white/80 dark:bg-[#1a1518]/80 focus:border-primary-500 focus:outline-none dark:text-white transition-colors"
              />
            </div>
            
            <Button
              type="submit"
              isLoading={submitting}
              className="w-full bg-gradient-to-r from-[#F2A7B7] to-primary-500 text-white font-semibold py-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              GỬI
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
