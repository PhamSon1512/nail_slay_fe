import sanitizeHtml from 'sanitize-html';
import { cn } from '~/utils';

type RichContentProps = {
  html?: string | null;
  className?: string;
};

const HTML_TAG_RE = /<\/?[a-z][\s\S]*>/i;

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'u',
    'a',
    'ul',
    'ol',
    'li',
    'img',
    'span',
    'div',
    'h2',
    'h3',
    'h4',
    'blockquote',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'hr',
    'audio',
    'video',
    'source',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel', 'class'],
    img: ['src', 'alt', 'title', 'class', 'style'],
    p: ['class', 'style'],
    span: ['class', 'style'],
    div: ['class', 'style'],
    ul: ['class'],
    ol: ['class'],
    li: ['class'],
    h2: ['id', 'class'],
    h3: ['id', 'class'],
    h4: ['id', 'class'],
    table: ['class', 'style'],
    th: ['class', 'style', 'colspan', 'rowspan'],
    td: ['class', 'style', 'colspan', 'rowspan'],
    audio: ['src', 'controls', 'class'],
    video: ['src', 'controls', 'class'],
    source: ['src', 'type'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
  },
};

function toDisplayHtml(raw: string): string {
  if (!raw.trim()) return '';
  if (HTML_TAG_RE.test(raw)) return raw;
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<p class="whitespace-pre-line">${escaped}</p>`;
}

export function RichContent({ html, className }: RichContentProps) {
  if (!html?.trim()) return null;

  const safe = sanitizeHtml(toDisplayHtml(html), SANITIZE_OPTIONS);

  return (
    <div
      className={cn(
        'prose prose-sm md:prose-base max-w-none',
        'prose-p:text-[#1D1D1D] dark:prose-p:text-[#FFDDE5]/90',
        'prose-li:text-[#1D1D1D] dark:prose-li:text-[#FFDDE5]/90',
        'prose-strong:text-[#1D1D1D] dark:prose-strong:text-[#FFF3F5]',
        'prose-a:text-[#F2A7B7] prose-a:no-underline hover:prose-a:underline',
        'prose-img:rounded-xl prose-img:my-4 prose-img:max-w-full prose-img:mx-auto',
        '[&_ul.article-toc]:list-none [&_ul.article-toc]:my-6 [&_ul.article-toc]:p-4 [&_ul.article-toc]:md:p-5',
        '[&_ul.article-toc]:rounded-xl [&_ul.article-toc]:border [&_ul.article-toc]:border-primary-200/80',
        '[&_ul.article-toc]:bg-gradient-to-br [&_ul.article-toc]:from-primary-50/80 [&_ul.article-toc]:to-white',
        'dark:[&_ul.article-toc]:from-[#2a2226] dark:[&_ul.article-toc]:to-[#1f1a1d] dark:[&_ul.article-toc]:border-primary-500/20',
        '[&_ul.article-toc>li:first-child]:text-base [&_ul.article-toc>li:first-child]:font-heading [&_ul.article-toc>li:first-child]:font-bold',
        '[&_ul.article-toc>li:first-child]:text-[#1D1D1D] dark:[&_ul.article-toc>li:first-child]:text-[#FFF3F5]',
        '[&_ul.article-toc>li:first-child]:border-b [&_ul.article-toc>li:first-child]:border-primary-200/60',
        '[&_ul.article-toc>li:first-child]:pb-2 [&_ul.article-toc>li:first-child]:mb-2',
        '[&_ul.article-toc_.toc-item]:relative [&_ul.article-toc_.toc-item]:my-1.5',
        '[&_ul.article-toc_.toc-item]:before:content-[""] [&_ul.article-toc_.toc-item]:before:absolute [&_ul.article-toc_.toc-item]:before:w-1.5 [&_ul.article-toc_.toc-item]:before:h-1.5 [&_ul.article-toc_.toc-item]:before:rounded-full [&_ul.article-toc_.toc-item]:before:top-[0.45rem]',
        '[&_ul.article-toc_.toc-l2]:pl-5 [&_ul.article-toc_.toc-l2]:font-semibold [&_ul.article-toc_.toc-l2]:text-sm [&_ul.article-toc_.toc-l2]:before:bg-[#ff6ea8] [&_ul.article-toc_.toc-l2]:before:left-1 [&_ul.article-toc_.toc-l2]:before:shadow-[0_0_0_3px_rgba(255,110,168,0.18)]',
        '[&_ul.article-toc_.toc-l3]:pl-10 [&_ul.article-toc_.toc-l3]:text-[0.8125rem] [&_ul.article-toc_.toc-l3]:font-medium [&_ul.article-toc_.toc-l3]:before:bg-[#ff93bf] [&_ul.article-toc_.toc-l3]:before:left-6',
        '[&_ul.article-toc_.toc-l4]:pl-14 [&_ul.article-toc_.toc-l4]:text-xs [&_ul.article-toc_.toc-l4]:text-[#8E8A8A] [&_ul.article-toc_.toc-l4]:before:bg-[#ffc2d9] [&_ul.article-toc_.toc-l4]:before:left-10',
        '[&_ul.article-toc_a]:text-[#b42362] dark:[&_ul.article-toc_a]:text-primary-300',
        '[&_ul.article-toc_a]:no-underline hover:[&_ul.article-toc_a]:underline',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
