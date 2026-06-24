import { useMemo } from 'react';
import { slugifyVi } from '~/utils/slugify';

const INTERNAL_DOMAIN = 'https://nailslaystudio.com/';

function isInternalSeoLink(href: string): boolean {
  return href.startsWith('/') || href.startsWith(INTERNAL_DOMAIN);
}

function isExternalSeoLink(href: string): boolean {
  if (!href) return false;
  if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return false;
  return !isInternalSeoLink(href);
}
export type SeoCheck = {
  id: string;
  label: string;
  passed: boolean;
  tooltip: string;
};

export type SeoAnalysisInput = {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  contentHtml: string;
  excerpt: string;
  siteDomain?: string;
  focusKeywordUnique?: boolean | null;
};

export type SeoAnalysisResult = {
  score: number;
  keywordDensity: number;
  wordCount: number;
  basicChecks: SeoCheck[];
  additionalChecks: SeoCheck[];
  titleReadability: SeoCheck[];
  contentReadability: SeoCheck[];
};

function stripHtml(html: string): string {
  if (typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent ?? div.innerText ?? '').replace(/\s+/g, ' ').trim();
  }
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeKeyword(kw: string): string {
  return kw.trim().toLowerCase();
}

function keywordInText(text: string, keyword: string): boolean {
  const k = normalizeKeyword(keyword);
  if (!k || !text.trim()) return false;
  return text.toLowerCase().includes(k);
}

function countKeywordOccurrences(text: string, keyword: string): number {
  const k = normalizeKeyword(keyword);
  if (!k) return 0;
  const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped, 'gi');
  return (text.match(re) ?? []).length;
}

function getWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

function getFirstNWords(text: string, n: number): string {
  return getWords(text).slice(0, n).join(' ');
}

function parseDom(html: string): Document | null {
  if (typeof document === 'undefined') return null;
  const parser = new DOMParser();
  return parser.parseFromString(html || '<div></div>', 'text/html');
}


function checkExternalLinks(doc: Document | null): boolean {
  if (!doc) return false;
  for (const a of doc.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href') ?? '';
    if (isExternalSeoLink(href)) return true;
  }
  return false;
}

function checkInternalLinks(doc: Document | null): boolean {
  if (!doc) return false;
  for (const a of doc.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href') ?? '';
    if (isInternalSeoLink(href)) return true;
  }
  return false;
}

function checkKeywordInHeadings(doc: Document | null, kw: string): boolean {
  if (!doc || !kw) return false;
  for (const h of doc.querySelectorAll('h2, h3, h4')) {
    if (keywordInText(h.textContent ?? '', kw)) return true;
  }
  return false;
}

function checkKeywordInImageAlt(doc: Document | null, kw: string): boolean {
  if (!doc || !kw) return false;
  for (const img of doc.querySelectorAll('img[alt]')) {
    if (keywordInText(img.getAttribute('alt') ?? '', kw)) return true;
  }
  return false;
}

function getParagraphWordCounts(doc: Document | null): number[] {
  if (!doc) return [];
  return Array.from(doc.querySelectorAll('p'))
    .map((p) => getWords((p.textContent ?? '').trim()).length)
    .filter((len) => len > 0);
}

function keywordNearTitleStart(title: string, kw: string): boolean {
  const k = normalizeKeyword(kw);
  if (!k || !title.trim()) return false;
  const lower = title.toLowerCase();
  const idx = lower.indexOf(k);
  if (idx < 0) return false;
  return idx <= Math.max(10, Math.floor(title.length * 0.3));
}

export function analyzeSeo(input: SeoAnalysisInput): SeoAnalysisResult {
  const kw = input.focusKeyword.trim();
  const hasKeyword = kw.length > 0;
  const seoTitle = input.metaTitle.trim();
  const metaDesc = input.metaDescription.trim();
  const slug = input.slug.trim();
  const plain = stripHtml(input.contentHtml);
  const wordCount = getWords(plain).length;
  const hasContent = wordCount > 0;
  const keywordCount = countKeywordOccurrences(plain, kw);
  const keywordDensity = wordCount > 0 && hasKeyword ? (keywordCount / wordCount) * 100 : 0;
  const slugNorm = slugifyVi(slug);
  const kwSlug = slugifyVi(kw);
  const doc = parseDom(input.contentHtml);

  const introWords = Math.max(50, Math.ceil(wordCount * 0.1));
  const paragraphLengths = getParagraphWordCounts(doc);
  const avgParagraph =
    paragraphLengths.length > 0 ? paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length : 0;
  const imageCount = doc?.querySelectorAll('img').length ?? 0;
  const videoCount = doc?.querySelectorAll('video').length ?? 0;
  const hasToc = Boolean(doc?.querySelector('.article-toc, nav.article-toc, ul.article-toc'));

  const basicChecks: SeoCheck[] = [
    {
      id: 'keyword-in-seo-title',
      label: 'Thêm từ khóa chính vào tiêu đề SEO.',
      passed: hasKeyword && keywordInText(seoTitle, kw),
      tooltip: 'Meta Title nên chứa từ khóa chính một cách tự nhiên.',
    },
    {
      id: 'keyword-in-meta-desc',
      label: 'Thêm từ khóa chính vào thẻ mô tả meta SEO của bạn.',
      passed: hasKeyword && keywordInText(metaDesc, kw),
      tooltip: 'Meta Description nên chứa từ khóa chính (khoảng 120–160 ký tự).',
    },
    {
      id: 'keyword-in-url',
      label: 'Sử dụng từ khóa chính trong URL.',
      passed: hasKeyword && slug.length > 0 && kwSlug.length > 0 && slugNorm.includes(kwSlug),
      tooltip: 'Slug URL nên chứa từ khóa chính (không dấu, nối bằng gạch ngang).',
    },
    {
      id: 'keyword-in-intro',
      label: 'Sử dụng Từ khoá chính ngay từ đầu nội dung của bạn.',
      passed: hasKeyword && hasContent && keywordInText(getFirstNWords(plain, introWords), kw),
      tooltip: 'Xuất hiện từ khóa trong phần mở đầu bài viết.',
    },
    {
      id: 'keyword-in-content',
      label: 'Đưa Từ khóa chính vào trong nội dung của bạn.',
      passed: hasKeyword && hasContent && keywordCount >= 1,
      tooltip: 'Từ khóa chính cần xuất hiện ít nhất 1 lần trong thân bài.',
    },
    {
      id: 'content-length',
      label: 'Nội dung nên dài ít nhất 600 words.',
      passed: wordCount >= 600,
      tooltip: `Hiện tại: ${wordCount} từ. Mục tiêu: trên 600 từ.`,
    },
  ];

  const densityLabel =
    keywordDensity === 0
      ? 'Mật độ từ khóa là 0. Hãy nhắm đến Mật độ từ khóa khoảng 1%.'
      : `Mật độ từ khóa là ${keywordDensity.toFixed(2)}%. Hãy nhắm đến Mật độ từ khóa khoảng 1%.`;

  const additionalChecks: SeoCheck[] = [
    {
      id: 'keyword-in-subheading',
      label: 'Sử dụng Từ khóa chính trong (các) tiêu đề phụ như H2, H3, H4, v.v.',
      passed: hasKeyword && hasContent && checkKeywordInHeadings(doc, kw),
      tooltip: 'Đưa từ khóa vào ít nhất một tiêu đề H2, H3 hoặc H4.',
    },
    {
      id: 'keyword-in-image-alt',
      label: 'Thêm hình ảnh với Từ khóa chính của bạn làm văn bản thay thế.',
      passed: hasKeyword && hasContent && checkKeywordInImageAlt(doc, kw),
      tooltip: 'Ít nhất một ảnh nên có alt text chứa từ khóa chính.',
    },
    {
      id: 'keyword-density',
      label: densityLabel,
      passed: hasKeyword && hasContent && keywordDensity >= 0.5 && keywordDensity <= 1.5,
      tooltip: 'Mật độ từ khóa lý tưởng khoảng 1% (0.5%–1.5%).',
    },
    {
      id: 'url-short',
      label: 'URL không khả dụng. Hãy thêm một URL ngắn.',
      passed: slug.length > 0 && slug.length <= 75,
      tooltip: 'Permalink nên ngắn gọn, dưới 75 ký tự.',
    },
    {
      id: 'external-links',
      label: 'Liên kết đến các tài nguyên bên ngoài.',
      passed: hasContent && checkExternalLinks(doc),
      tooltip: 'Thêm ít nhất 1 liên kết ra website bên ngoài.',
    },
    {
      id: 'internal-links',
      label: 'Thêm liên kết nội bộ trong nội dung của bạn.',
      passed: hasContent && checkInternalLinks(doc),
      tooltip: 'Liên kết nội bộ giúp SEO và giữ chân người đọc.',
    },
    {
      id: 'focus-keyword-set',
      label: 'Đặt Từ khóa chính cho nội dung này.',
      passed: hasKeyword,
      tooltip: 'Nhập từ khóa chính ở trường Từ khóa chính.',
    },
  ];

  const titleReadability: SeoCheck[] = [
    {
      id: 'keyword-near-title-start',
      label: 'Sử dụng Từ khóa chính gần phần đầu của tiêu đề SEO.',
      passed: hasKeyword && seoTitle.length > 0 && keywordNearTitleStart(seoTitle, kw),
      tooltip: 'Đặt từ khóa gần đầu tiêu đề SEO để tăng relevancy.',
    },
    {
      id: 'title-has-number',
      label: 'Tiêu đề SEO của bạn không chứa số.',
      passed: seoTitle.length > 0 && /\d/.test(seoTitle),
      tooltip: 'Tiêu đề có số (vd: "10 cách...") thường thu hút click hơn.',
    },
  ];

  const contentReadability: SeoCheck[] = [
    {
      id: 'content-has-toc',
      label: 'Sử dụng Mục lục để chia nhỏ văn bản của bạn.',
      passed: hasContent && hasToc,
      tooltip: 'Chèn mục lục (TOC) để cải thiện trải nghiệm đọc.',
    },
    {
      id: 'short-paragraphs',
      label: 'Thêm các đoạn văn ngắn gọn và súc tích để dễ đọc và UX tốt hơn.',
      passed: hasContent && paragraphLengths.length > 0 && avgParagraph <= 120,
      tooltip: 'Mỗi đoạn nên ngắn gọn, trung bình dưới 120 từ.',
    },
    {
      id: 'content-has-media',
      label: 'Thêm một vài hình ảnh và / hoặc video để làm cho nội dung của bạn hấp dẫn hơn.',
      passed: hasContent && (imageCount >= 1 || videoCount >= 1),
      tooltip: 'Bổ sung ảnh hoặc video minh họa trong bài viết.',
    },
  ];

  const allChecks = [...basicChecks, ...additionalChecks, ...titleReadability, ...contentReadability];
  const passedCount = allChecks.filter((c) => c.passed).length;
  const score = allChecks.length > 0 ? Math.round((passedCount / allChecks.length) * 100) : 0;

  return {
    score,
    keywordDensity,
    wordCount,
    basicChecks,
    additionalChecks,
    titleReadability,
    contentReadability,
  };
}

export function useSeoAnalysis(input: SeoAnalysisInput): SeoAnalysisResult {
  return useMemo(
    () => analyzeSeo(input),
    [
      input.title,
      input.slug,
      input.metaTitle,
      input.metaDescription,
      input.focusKeyword,
      input.contentHtml,
      input.excerpt,
      input.focusKeywordUnique,
    ],
  );
}
