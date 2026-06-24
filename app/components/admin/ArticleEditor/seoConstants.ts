/** Điểm SEO tối thiểu để được xuất bản bài viết */
export const SEO_PUBLISH_MIN_SCORE = 80;

export const SITE_ORIGIN = 'https://nailslaystudio.com';

/** Liên kết nội bộ: bắt đầu bằng https://nailslaystudio.com/ */
export const SITE_INTERNAL_LINK_PREFIX = `${SITE_ORIGIN}/`;

export function canPublishBySeoScore(score: number): boolean {
  return score >= SEO_PUBLISH_MIN_SCORE;
}

export function seoScoreColorClass(score: number): 'success' | 'warning' | 'danger' {
  if (score >= SEO_PUBLISH_MIN_SCORE) return 'success';
  if (score >= 50) return 'warning';
  return 'danger';
}

export function isInternalSeoLink(href: string): boolean {
  const normalized = href.trim().toLowerCase();
  if (!normalized) return false;
  return (
    normalized.startsWith(SITE_INTERNAL_LINK_PREFIX.toLowerCase()) ||
    normalized === SITE_ORIGIN.toLowerCase()
  );
}

export function isExternalSeoLink(href: string): boolean {
  const normalized = href.trim();
  if (!normalized || normalized.startsWith('#') || normalized.startsWith('mailto:') || normalized.startsWith('tel:')) {
    return false;
  }
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    return false;
  }
  return !isInternalSeoLink(normalized);
}

export function toAbsoluteInternalUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return SITE_ORIGIN;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `${SITE_ORIGIN}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}
