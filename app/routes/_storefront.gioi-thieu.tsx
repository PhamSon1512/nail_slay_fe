import type { Route } from './+types/_storefront.gioi-thieu';
import { Button } from '@heroui/react';
import { Link } from 'react-router';
import { RiBrushLine, RiRulerLine, RiVipDiamondLine, RiGiftLine, RiArrowRightSLine } from 'react-icons/ri';
import { SectionTitle } from '~/components';

export const handle = { pageTitle: 'Về Nailslay' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Về Nailslay - Slay Your Nails, Everyday' }];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* KHỐI 1: HERO BANNER (PREMIUM REDESIGN) */}
      <section className="relative w-full min-h-[70vh] md:min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image with slight scale for premium feel */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: 'url("/images/about-hero.jpg")' }}
        />
        {/* Subtle Gradient Overlay (Thay cho overlay 80% làm bệt ảnh) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-white/10 to-[#FFF3F5]/95" />
        
        {/* Content - Glassmorphism Card */}
        <div className="relative z-10 container flex flex-col items-center px-4 mt-10">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center p-8 md:p-14 rounded-[2.5rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(242,167,183,0.15)] animate-in fade-in zoom-in duration-1000">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white/50 shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#F2A7B7] animate-pulse" />
              <span className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[#F2A7B7]">
                SLAY YOUR NAILS, EVERYDAY
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#1D1D1D] mb-6 leading-[1.2] drop-shadow-sm">
              Nailslay — Đưa Tiệm Nail Về <br className="hidden md:block" /> Tận Màn Hình Của Bạn
            </h1>
            
            <p className="text-lg md:text-xl text-[#5A5A5A] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Chúng mình ra đời với sứ mệnh mang đến những bộ Nailbox thiết kế thủ công tinh xảo, giúp bạn sở hữu bộ móng xinh chuẩn tiệm chỉ trong 5 phút dán tại nhà.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              <Button
                as={Link}
                to="/san-pham"
                className="w-full sm:w-auto bg-gradient-to-tr from-[#F2A7B7] to-primary-500 text-white font-semibold px-10 py-7 rounded-full shadow-[0_8px_20px_rgba(242,167,183,0.4)] hover:shadow-[0_12px_25px_rgba(242,167,183,0.6)] hover:-translate-y-1 transition-all duration-300 text-base"
              >
                Khám Phá Sản Phẩm
              </Button>
              <Button
                as={Link}
                to="/huong-dan"
                className="w-full sm:w-auto bg-white text-[#F2A7B7] font-semibold px-10 py-7 rounded-full border-2 border-white shadow-[0_8px_20px_rgba(255,255,255,0.4)] hover:border-[#F2A7B7] hover:-translate-y-1 transition-all duration-300 text-base"
              >
                Xem Hướng Dẫn Đo Size
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* KHỐI 2: CÂU CHUYỆN THƯƠNG HIỆU */}
      <section className="py-20 md:py-28 container px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Cột Trái - Text */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            <div>
              <span className="text-sm font-bold tracking-widest uppercase text-[#F2A7B7] mb-2 block">
                Câu chuyện của Nailslay
              </span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1D1D1D] leading-tight">
                "Làm đẹp không nên là sự chờ đợi"
              </h2>
            </div>
            
            <div className="space-y-4 text-base md:text-lg text-[#5A5A5A] leading-relaxed">
              <p>
                Tụi mình hiểu rằng, ai trong chúng ta cũng yêu thích cảm giác sở hữu một bộ móng xinh xắn để tự tin xuống phố hay dự tiệc. Nhưng không phải lúc nào bạn cũng có đủ 2 - 3 tiếng đồng hồ ngồi ngoài tiệm, hoặc muốn chi trả một khoản tiền quá đắt đỏ cho một bộ móng chỉ diện vài ngày.
              </p>
              <p className="font-semibold text-[#1D1D1D]">
                Đó là lý do Nailslay ra đời.
              </p>
              <p>
                Nailslay không sản xuất móng nhựa in hàng loạt. Mỗi bộ Nailbox từ nhà Nailslay đều là một tác phẩm sơn gel thủ công, được chăm chút tỉ mỉ từ khâu chọn cốt móng, phối màu đến nét vẽ đính đá 3D. Chúng mình muốn mang đến cho bạn trải nghiệm làm đẹp: <strong className="text-primary-500">Nhanh chóng - Tiện lợi - Chuẩn form - Tiết kiệm.</strong>
              </p>
            </div>

            <div className="mt-4 p-6 bg-[#FFF3F5] rounded-2xl border-l-4 border-[#F2A7B7] shadow-sm">
              <p className="text-base font-medium italic text-[#1D1D1D]">
                "Dù bạn là cô nàng Y2K cá tính, tiểu thư đính đá sang chảnh hay theo đuổi phong cách công sở tối giản — Nailslay luôn có thiết kế riêng giúp bạn sẵn sàng 'Slay' mọi lúc, mọi nơi."
              </p>
            </div>
          </div>

          {/* Cột Phải - Ảnh */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF3F5] to-primary-100 rounded-[2rem] transform rotate-3 scale-105 -z-10" />
            <img 
              src="/images/about-story.jpg" 
              alt="Hũ sơn gel thủ công Nailslay" 
              className="w-full h-auto object-cover rounded-2xl shadow-xl border-4 border-white aspect-[4/5] md:aspect-auto md:h-[600px]"
            />
          </div>
        </div>
      </section>

      {/* KHỐI 3: GIÁ TRỊ CỐT LÕI */}
      <section className="py-20 bg-gray-50/50">
        <div className="container px-4">
          <SectionTitle
            title="Giá Trị Cốt Lõi"
            subtitle="Những điều làm nên sự khác biệt của bộ sưu tập Nailslay"
            align="center"
            className="mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Thẻ 1 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <RiBrushLine size={32} className="text-[#F2A7B7]" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-3">100% Sơn Gel Thủ Công</h3>
              <p className="text-[#5A5A5A] leading-relaxed">
                Tất cả mẫu móng đều được dũa form, sơn gel nhiều lớp và vẽ tay thủ công, giữ độ bóng đẹp và bền màu y hệt làm tại tiệm.
              </p>
            </div>

            {/* Thẻ 2 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <RiRulerLine size={32} className="text-[#F2A7B7]" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-3">Thiết Kế Theo Size Chuẩn</h3>
              <p className="text-[#5A5A5A] leading-relaxed">
                Nói không với móng freesize bị lệch/rộng. Nailslay làm móng dựa trên số đo thực tế 10 ngón của riêng bạn.
              </p>
            </div>

            {/* Thẻ 3 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <RiVipDiamondLine size={32} className="text-[#F2A7B7]" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-3">Cập Nhật Trend Liên Tục</h3>
              <p className="text-[#5A5A5A] leading-relaxed">
                Đa dạng phong cách từ Y2K, Korea Style, Mắt mèo aurora đến Tiểu thư đính đá. Luôn có mẫu mới mỗi tuần.
              </p>
            </div>

            {/* Thẻ 4 */}
            <div className="bg-white rounded-2xl p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group">
              <div className="w-16 h-16 rounded-full bg-[#FFF3F5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <RiGiftLine size={32} className="text-[#F2A7B7]" />
              </div>
              <h3 className="text-xl font-bold text-[#1D1D1D] mb-3">Tái Sử Dụng Nhiều Lần</h3>
              <p className="text-[#5A5A5A] leading-relaxed">
                Tặng kèm đầy đủ bộ dụng cụ (keo, dũa, miếng dán silicon, que đẩy da). Móng tháo lắp dễ dàng và dùng lại được 3-5 lần.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KHỐI 4: LỜI NHẮN & FINAL CTA */}
      <section className="py-20 md:py-28 container px-4">
        <div className="max-w-4xl mx-auto bg-[#FFF3F5] rounded-[2.5rem] p-10 md:p-16 text-center shadow-lg border border-primary-100">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1D1D1D] mb-6">
            Bạn Đã Sẵn Sàng "Slay" Cùng Bộ Móng Mới Chưa?
          </h2>
          <p className="text-lg text-[#5A5A5A] max-w-2xl mx-auto mb-10 leading-relaxed">
            Đừng ngần ngại nhắn tin cho Nailslay nếu bạn cần tư vấn chọn mẫu hay hướng dẫn đo size móng nhé. Chúng mình luôn ở đây để giúp bạn đẹp hơn mỗi ngày!
          </p>
          <Button
            as={Link}
            to="/san-pham"
            className="w-full sm:w-auto bg-gradient-to-tr from-[#F2A7B7] to-primary-600 text-white font-medium px-10 py-7 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg group"
          >
            KHÁM PHÁ BỘ SƯU TẬP NGAY 
            <RiArrowRightSLine size={24} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

    </div>
  );
}
