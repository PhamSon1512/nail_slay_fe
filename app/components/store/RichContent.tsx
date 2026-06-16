import DOMPurify from 'isomorphic-dompurify';
import { cn } from '~/utils';

type RichContentProps = {
  html?: string | null;
  className?: string;
};

const HTML_TAG_RE = /<\/?[a-z][\s\S]*>/i;

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

  const safe = DOMPurify.sanitize(toDisplayHtml(html), {
    ADD_ATTR: ['target', 'rel', 'class'],
    ALLOWED_TAGS: [
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
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'style'],
  });

  return (
    <div
      className={cn(
        'prose prose-sm md:prose-base max-w-none',
        'prose-p:text-[#1D1D1D] dark:prose-p:text-[#FFDDE5]/90',
        'prose-li:text-[#1D1D1D] dark:prose-li:text-[#FFDDE5]/90',
        'prose-strong:text-[#1D1D1D] dark:prose-strong:text-[#FFF3F5]',
        'prose-a:text-[#F2A7B7] prose-a:no-underline hover:prose-a:underline',
        'prose-img:rounded-xl prose-img:my-4 prose-img:max-w-full prose-img:mx-auto',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
