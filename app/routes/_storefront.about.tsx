import type { Route } from './+types/_storefront.about';
import { BrandLogoFrame, SectionTitle } from '~/components';
import { BRAND } from '~/data';

export const handle = { pageTitle: 'Về NailSlay' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Về NailSlay - NailSlay' }];

const COLOR_SWATCHES = [
  { name: 'Primary', hex: BRAND.colors.primary, usage: 'Nút bấm, điểm nhấn' },
  { name: 'Soft Pink', hex: BRAND.colors.softPink, usage: 'Nền phụ, accent nhẹ' },
  { name: 'Background', hex: BRAND.colors.background, usage: 'Nền chính website' },
  { name: 'Contrast', hex: BRAND.colors.contrast, usage: 'Chữ chính, khối tương phản' },
  { name: 'Neutral', hex: BRAND.colors.neutral, usage: 'Mô tả phụ, ghi chú' },
];

/** Tùy chỉnh khung logo trang About — không dùng brand-logo-ring (bị giới hạn ~40px) */
const ABOUT_LOGO_FRAME = {
  size: 'md' as const,
  borderWidth: 2,
  borderColor: 'rgba(242, 167, 183, 0.55)',
  borderRadius: '9999px',
  backgroundColor: '#FFFFFF',
  padding: 8,
  imageScale: 1.2,
  shadow: 'rose' as const,
};

export default function AboutPage() {
  return (
    <div className="container py-10 md:py-14">
      <SectionTitle
        title="Về NailSlay"
        subtitle="Thương hiệu nail box thiết kế — SLAY YOUR NAIL, EVERYDAY."
        align="center"
        className="mb-10 md:mb-14"
      />

      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch justify-center">
        <section className="relative flex min-h-[22rem] flex-col rounded-2xl border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] p-6 md:min-h-[26rem] md:p-8">
          <h2 className="font-heading text-lg font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] mb-5 text-center lg:text-left">
            Nhận diện thương hiệu
          </h2>

          <BrandLogoFrame
            src={BRAND.assets.logo}
            alt={BRAND.name}
            className="absolute top-5 right-5 md:top-6 md:right-6"
            {...ABOUT_LOGO_FRAME}
          />

          <div className="flex flex-1 flex-col justify-center gap-5 pr-28 text-center md:gap-7 md:pr-32 lg:gap-8 lg:text-left">
            <p className="brand-name text-3xl md:text-4xl">{BRAND.name}</p>
            <p className="text-xs uppercase tracking-[0.28em] text-[#F2A7B7] md:text-sm md:tracking-[0.32em]">
              {BRAND.slogan}
            </p>
            <p className="text-sm leading-relaxed text-[#8E8A8A] md:text-base md:leading-7">
              NailSlay mang đến bộ sưu tập nail box cao cấp — từ Y2K cá tính, tiểu thư đính đá đến tone công
              sở nhẹ nhàng, cùng phụ kiện giúp bạn tự làm đẹp tại nhà.
            </p>
          </div>
        </section>

        <section className="flex flex-col rounded-2xl border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] p-6 md:p-8">
          <h2 className="font-heading text-lg font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] mb-2 text-center lg:text-left">
            Bảng màu
          </h2>
          <p className="mb-5 text-center text-sm text-[#8E8A8A] lg:text-left">
            Nền chính <strong className="text-[#1D1D1D] dark:text-[#FFF3F5]">#FFF3F5</strong>, chữ{' '}
            <strong className="text-[#1D1D1D] dark:text-[#FFF3F5]">#1D1D1D</strong>, highlight{' '}
            <strong className="text-[#F2A7B7]">#F2A7B7</strong>.
          </p>
          <div className="grid flex-1 grid-cols-2 content-center gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {COLOR_SWATCHES.map((color) => (
              <div
                key={color.hex}
                className="overflow-hidden rounded-xl border border-primary-200/60 bg-white dark:bg-[#2a2226]"
              >
                <div className="h-12 md:h-14" style={{ backgroundColor: color.hex }} />
                <div className="space-y-0.5 p-3">
                  <p className="text-xs font-semibold text-[#1D1D1D] dark:text-[#FFF3F5]">{color.name}</p>
                  <p className="font-mono text-[11px] text-[#8E8A8A]">{color.hex}</p>
                  <p className="text-[11px] text-[#8E8A8A]">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
