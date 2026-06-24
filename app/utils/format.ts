export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Display price with Montserrat-friendly suffix (no currency style). */
export function formatPriceDisplay(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}₫`;
}

/** Percentage off when original price is higher than sale price. */
export function calcDiscountPercent(original: number, sale: number): number {
  if (original <= 0 || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/** "Thứ Hai, ngày 23 tháng 6 năm 2026 lúc 14:30" */
export function formatPublishDateVi(date: string | Date): string {
  const d = new Date(date);
  const weekday = new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(d);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const time = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
  const cap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${cap}, ngày ${day} tháng ${month} năm ${year} lúc ${time}`;
}

export function shortId(id: string): string {
  return `#${id.slice(-6).toUpperCase()}`;
}

/** Chuyển chuỗi UPPERCASE hoặc không dấu sang dạng viết hoa chữ cái đầu từng từ. */
export function formatTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export const VAT_RATE = 0.1;

/** VAT amount when listed prices already include VAT (tax-inclusive). */
export function calcVatIncluded(totalInclusive: number): number {
  return Math.round((totalInclusive * VAT_RATE) / (1 + VAT_RATE));
}

/** @deprecated Use calcVatIncluded for tax-inclusive display; kept for legacy callers. */
export function calcVat(subtotal: number): number {
  return Math.round(subtotal * VAT_RATE);
}
