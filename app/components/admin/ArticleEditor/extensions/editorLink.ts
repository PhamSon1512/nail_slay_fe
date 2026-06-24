import TiptapLink from '@tiptap/extension-link';
import { mergeAttributes } from '@tiptap/core';

export const LINK_TOOLTIP = 'Ctrl+văn bản để mở đường dẫn';

export const EditorLink = TiptapLink.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, {
        class: 'article-editor-link',
        title: LINK_TOOLTIP,
      }),
      0,
    ];
  },
}).configure({
  openOnClick: false,
  HTMLAttributes: {
    class: 'article-editor-link',
  },
});
