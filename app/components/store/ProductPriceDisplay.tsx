import { formatPriceDisplay } from '~/utils/format';

type ProductPriceDisplayProps = {
  price: number;
  originalPrice?: number;
  hasDiscount?: boolean;
};

const SPARKLES = [
  { top: '8%', left: '6%', delay: '0s', size: 10 },
  { top: '18%', right: '8%', delay: '0.8s', size: 8 },
  { top: '55%', left: '4%', delay: '1.4s', size: 7 },
  { top: '70%', right: '12%', delay: '0.3s', size: 9 },
  { top: '32%', right: '22%', delay: '1.1s', size: 6 },
  { top: '82%', left: '18%', delay: '1.7s', size: 7 },
];

export function ProductPriceDisplay({
  price,
  originalPrice = 0,
  hasDiscount = false,
}: ProductPriceDisplayProps) {
  const savings = hasDiscount ? originalPrice - price : 0;

  return (
    <div className="nail-price-box relative overflow-hidden rounded-2xl px-5 py-4">
      <div className="nail-price-glow pointer-events-none" aria-hidden />
      <div className="nail-price-sparkles pointer-events-none" aria-hidden>
        {SPARKLES.map((s, i) => (
          <span
            key={i}
            className="nail-price-sparkle"
            style={{
              top: s.top,
              left: 'left' in s ? s.left : undefined,
              right: 'right' in s ? s.right : undefined,
              animationDelay: s.delay,
              fontSize: s.size,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="relative z-[1]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9d5167] dark:text-[#de8a9b] mb-2">
          Giá bán
        </p>

        <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
          <span className="nail-price-shimmer font-sans text-4xl md:text-[2.75rem] font-extrabold tabular-nums leading-none">
            {formatPriceDisplay(price)}
          </span>
          {hasDiscount ? (
            <span className="font-sans text-base text-[#8E8A8A] line-through tabular-nums pb-0.5">
              {formatPriceDisplay(originalPrice)}
            </span>
          ) : null}
        </div>

        {hasDiscount ? (
          <p className="mt-2.5 text-xs text-[#8E8A8A] bg-primary-50/50 dark:bg-[#32282c]/50 inline-block px-2 py-1 rounded-md border border-primary-100/50 dark:border-primary-900/30">
            🔥 Tiết kiệm <span className="nail-price-savings font-bold text-[#e83863] text-sm">{formatPriceDisplay(savings)}</span> so với giá gốc
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function ProductDiscountBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide nail-discount-badge text-white shadow-md">
      Giảm {percent}%
    </span>
  );
}
