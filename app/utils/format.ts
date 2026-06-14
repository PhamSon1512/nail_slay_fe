export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
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
