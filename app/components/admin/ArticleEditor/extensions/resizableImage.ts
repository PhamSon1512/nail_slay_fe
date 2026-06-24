import TiptapImage from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export type ImageAlign = 'left' | 'center' | 'right' | 'full';

export const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => el.getAttribute('width') || el.style.width?.replace('px', '') || null,
        renderHTML: (attrs) => {
          if (!attrs.width) return {};
          const w = String(attrs.width).replace(/px$/, '');
          return { width: w, style: `width: ${w}px; max-width: 100%; height: auto;` };
        },
      },
      align: {
        default: 'center',
        parseHTML: (el) => (el.getAttribute('data-align') as ImageAlign) || 'center',
        renderHTML: (attrs) => ({ 'data-align': attrs.align }),
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const align = (HTMLAttributes['data-align'] as ImageAlign) || 'center';
    let style = 'height: auto; max-width: 100%;';
    if (align === 'left') style += ' float: left; margin: 0.5rem 1rem 0.5rem 0;';
    else if (align === 'right') style += ' float: right; margin: 0.5rem 0 0.5rem 1rem;';
    else if (align === 'full') style += ' width: 100%; display: block; margin: 1rem 0;';
    else style += ' display: block; margin: 1rem auto;';

    const existing = HTMLAttributes.style ? String(HTMLAttributes.style) : '';
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        class: 'article-editor-image rounded-xl',
        style: `${existing} ${style}`.trim(),
      }),
    ];
  },
});
