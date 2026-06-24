import { useCallback, useEffect, useImperativeHandle, useState, forwardRef, useRef } from 'react';
import CharacterCount from '@tiptap/extension-character-count';
import { Color } from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import { mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { Button, Select, SelectItem, Tab, Tabs, Textarea } from '@heroui/react';
import toast from 'react-hot-toast';
import {
  RiAlignCenter,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiBold,
  RiDoubleQuotesL,
  RiFullscreenLine,
  RiImageAddLine,
  RiItalic,
  RiLink,
  RiListOrdered,
  RiListUnordered,
  RiMenu2Line,
  RiSeparator,
  RiStrikethrough,
  RiUnderline,
} from 'react-icons/ri';
import { uploadContentImage } from '~/utils/api/admin';
import { cn } from '~/utils';
import { ColorPaletteDropdown } from './ColorPaletteDropdown';
import { EditorMenuBar } from './EditorMenuBar';
import { EditorToolbarButton } from './EditorToolbarButton';
import { FontSize } from './extensions/fontSize';
import { ResizableImage } from './extensions/resizableImage';
import { FontSizeCombobox } from './FontSizeCombobox';
import { HeadingStyleSelect } from './HeadingStyleSelect';
import { ImageBubbleToolbar } from './ImageBubbleToolbar';
import { MediaPickerModal } from './MediaPickerModal';
import { TableMenuDropdown } from './TableMenuDropdown';
import { TableBubbleToolbar } from './TableBubbleToolbar';
import { ArticleHeading } from './extensions/articleHeading';
import { EditorLink } from './extensions/editorLink';
import { toAbsoluteInternalUrl } from './seoConstants';

type ArticleRichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export type ArticleRichTextEditorHandle = {
  insertInternalLink: (url: string, title: string) => void;
  openMediaPicker: () => void;
};

const DEFAULT_FONT = 'Arial, sans-serif';
const DEFAULT_FONT_SIZE = '11pt';

const FONT_FAMILIES = [
  { key: 'Arial, sans-serif', label: 'Arial' },
  { key: 'Georgia, serif', label: 'Georgia' },
  { key: 'Times New Roman, serif', label: 'Times New Roman' },
  { key: 'Verdana, sans-serif', label: 'Verdana' },
  { key: 'Tahoma, sans-serif', label: 'Tahoma' },
];

function slugifyAnchor(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60) || 'section'
  );
}

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.style.backgroundColor || null,
        renderHTML: attributes => {
          if (!attributes.backgroundColor) return {};
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
      },
    };
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.style.backgroundColor || null,
        renderHTML: attributes => {
          if (!attributes.backgroundColor) return {};
          return { style: `background-color: ${attributes.backgroundColor}` };
        },
      },
    };
  },
});

export const ArticleRichTextEditor = forwardRef<ArticleRichTextEditorHandle, ArticleRichTextEditorProps>(
  function ArticleRichTextEditor({ value, onChange, placeholder = 'Nhập nội dung bài viết...', className }, ref) {
    const [mode, setMode] = useState<'visual' | 'code'>('visual');
    const [codeValue, setCodeValue] = useState(value);
    const [fullscreen, setFullscreen] = useState(false);
    const [mediaOpen, setMediaOpen] = useState(false);
    const [, setToolbarTick] = useState(0);

    const uploadAndInsertImage = useCallback(async (file: File, ed: NonNullable<ReturnType<typeof useEditor>>) => {
      try {
        const { url } = await uploadContentImage(file);
        ed.chain().focus().setImage({ src: url, alt: '' }).run();
      } catch {
        // interceptor handles toast
      }
    }, []);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: false }),
        ArticleHeading.configure({ levels: [1, 2, 3, 4] }),
        Underline,
        EditorLink,
        TextAlign.configure({ types: ['heading', 'paragraph', 'image', 'tableCell', 'tableHeader'] }),
        TextStyle,
        FontSize,
        Color,
        FontFamily,
        Highlight.configure({ multicolor: true }),
        HorizontalRule,
        Table.configure({ resizable: true }),
        TableRow,
        CustomTableHeader,
        CustomTableCell,
        ResizableImage,
        Placeholder.configure({ placeholder }),
        CharacterCount,
      ],
      content: value || '',
      onUpdate: ({ editor: ed }) => {
        const html = ed.getHTML();
        lastValueRef.current = html;
        onChange(html);
      },
      editorProps: {
        attributes: {
          class:
            'prose prose-sm max-w-none min-h-[320px] px-4 py-3 focus:outline-none article-editor-prose',
          style: `font-family: ${DEFAULT_FONT}; font-size: ${DEFAULT_FONT_SIZE};`,
        },
        handlePaste: (_view, event) => {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile();
              if (file && editor) {
                event.preventDefault();
                void uploadAndInsertImage(file, editor);
                return true;
              }
            }
          }
          return false;
        },
        handleDrop: (_view, event) => {
          const file = event.dataTransfer?.files?.[0];
          if (file?.type.startsWith('image/') && editor) {
            event.preventDefault();
            void uploadAndInsertImage(file, editor);
            return true;
          }
          return false;
        },
        handleClick: (_view, _pos, event) => {
          const target = event.target as HTMLElement | null;
          const anchor = target?.closest('a');
          if (anchor) {
            const href = anchor.getAttribute('href');
            if (href?.startsWith('#')) {
              event.preventDefault();
              const id = href.substring(1);
              const el = _view.dom.querySelector(`#${id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              return true;
            }
            if (event.ctrlKey || event.metaKey) {
              event.preventDefault();
              window.open(anchor.href, '_blank', 'noopener,noreferrer');
              return true;
            }
          }
          return false;
        },
      },
    });

    const lastValueRef = useRef(value);

    useEffect(() => {
      if (!editor) return;
      let raf: number;
      const refresh = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setToolbarTick((t) => t + 1));
      };
      editor.on('transaction', refresh);
      return () => {
        editor.off('transaction', refresh);
        cancelAnimationFrame(raf);
      };
    }, [editor]);

    const insertAsset = useCallback(
      (payload: { url: string; mimeType: string; fileName: string }) => {
        if (!editor) return;
        const { url, mimeType, fileName } = payload;
        if (mimeType.startsWith('image/')) {
          editor.chain().focus().setImage({ src: url, alt: fileName }).run();
        } else if (mimeType.startsWith('audio/')) {
          editor.chain().focus().insertContent(`<audio controls src="${url}"></audio>`).run();
        } else if (mimeType.startsWith('video/')) {
          editor.chain().focus().insertContent(`<video controls src="${url}" class="max-w-full rounded-xl my-4"></video>`).run();
        } else {
          editor.chain().focus().insertContent(`<a href="${url}" target="_blank" rel="noopener noreferrer">${fileName}</a>`).run();
        }
      },
      [editor],
    );

    useEffect(() => {
      if (!editor) return;
      if (mode === 'visual' && value !== lastValueRef.current) {
        editor.commands.setContent(value || '', { emitUpdate: false });
        lastValueRef.current = value;
      }
      setCodeValue(value);
    }, [editor, value, mode]);

    const setLink = () => {
      if (!editor) return;
      const prev = editor.getAttributes('link').href as string | undefined;
      const url = window.prompt('URL liên kết', prev ?? 'https://');
      if (url === null) return;
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const insertImage = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const file = input.files?.[0];
        if (file && editor) void uploadAndInsertImage(file, editor);
      };
      input.click();
    };

    useImperativeHandle(
      ref,
      () => ({
        insertInternalLink: (url: string, title: string) => {
          const href = toAbsoluteInternalUrl(url);
          editor?.chain().focus().insertContent(`<a href="${href}">${title}</a>`).run();
        },
        openMediaPicker: () => setMediaOpen(true),
      }),
      [editor],
    );

    const getHeadingKey = () => {
      if (!editor) return 'paragraph';
      if (editor.isActive('heading', { level: 1 })) return '1';
      if (editor.isActive('heading', { level: 2 })) return '2';
      if (editor.isActive('heading', { level: 3 })) return '3';
      if (editor.isActive('heading', { level: 4 })) return '4';
      return 'paragraph';
    };

    const setHeading = (key: string) => {
      if (!editor) return;
      if (key === 'paragraph') {
        editor.chain().focus().setParagraph().run();
        return;
      }
      const level = Number(key) as 1 | 2 | 3 | 4;
      editor.chain().focus().toggleHeading({ level }).run();
    };

    const insertTableOfContents = () => {
      if (!editor) return;
      let html = editor.getHTML();
      html = html.replace(/<ul class="article-toc">[\s\S]*?<\/ul>/gi, '');
      html = html.replace(/<nav class="article-toc">[\s\S]*?<\/nav>/gi, '');
      const doc = new DOMParser().parseFromString(html || '<div></div>', 'text/html');
      const headings = Array.from(doc.querySelectorAll('h2, h3, h4'));
      if (headings.length === 0) {
        toast.error('Chưa có tiêu đề H2, H3 hoặc H4. Chọn "Heading 2/3/4" trong dropdown Đoạn văn rồi thử lại.');
        return;
      }

      const usedIds = new Set<string>();
      const items: string[] = [];
      headings.forEach((h) => {
        const text = (h.textContent ?? '').trim();
        if (!text) return;
        let id = slugifyAnchor(text);
        let n = 2;
        while (usedIds.has(id)) id = `${slugifyAnchor(text)}-${n++}`;
        usedIds.add(id);
        h.id = id;
        const indent = h.tagName === 'H3' ? ' class="ml-4"' : h.tagName === 'H4' ? ' class="ml-8"' : '';
        items.push(`<li${indent}><a href="#${id}">${text}</a></li>`);
      });

      if (items.length === 0) {
        toast.error('Không tìm thấy tiêu đề hợp lệ để tạo mục lục.');
        return;
      }

      const toc = `<ul class="article-toc"><li><strong>Mục lục</strong></li>${items.join('')}</ul>`;
      const next = `${toc}${doc.body.innerHTML}`;
      editor.commands.setContent(next);
      onChange(next);
      toast.success(`Đã chèn mục lục với ${items.length} mục.`);
    };

    const applyCode = () => {
      onChange(codeValue);
      editor?.commands.setContent(codeValue || '', { emitUpdate: false });
      setMode('visual');
    };

    const wrapperClass = cn(
      'border border-[#c3c4c7] bg-white shadow-sm overflow-hidden',
      fullscreen && 'fixed inset-4 z-50 flex flex-col shadow-2xl',
      className,
    );

    const currentFontSize = (editor?.getAttributes('textStyle').fontSize as string | undefined) ?? null;
    const currentFontFamily =
      (editor?.getAttributes('textStyle').fontFamily as string | undefined) ?? DEFAULT_FONT;

    return (
      <div className={wrapperClass}>
        {mode === 'visual' && editor && (
          <>
            <div className="flex items-center justify-between border-b border-[#c3c4c7] bg-[#f6f7f7] px-2 py-1">
              <EditorMenuBar
                editor={editor}
                mode={mode}
                fullscreen={fullscreen}
                onModeChange={(m) => {
                  if (m === 'code') setCodeValue(editor.getHTML());
                  setMode(m);
                }}
                onFullscreenToggle={() => setFullscreen((f) => !f)}
                onOpenMedia={() => setMediaOpen(true)}
                onInsertImage={insertImage}
                onSetLink={setLink}
                onInsertToc={insertTableOfContents}
              />
              <Tabs
                size="sm"
                selectedKey={mode}
                onSelectionChange={(k) => {
                  const next = k as 'visual' | 'code';
                  if (next === 'code') setCodeValue(editor.getHTML());
                  setMode(next);
                }}
                classNames={{ tabList: 'gap-0 bg-transparent', tab: 'h-7 min-h-7 px-3 text-xs' }}
              >
                <Tab key="visual" title="Trực quan" />
                <Tab key="code" title="Mã" />
              </Tabs>
            </div>

            <div className="border-b border-[#c3c4c7] bg-[#fafafa] p-1.5 space-y-1">
              <div className="flex flex-wrap items-center gap-1">
                <HeadingStyleSelect value={getHeadingKey()} onChange={setHeading} />
                <EditorToolbarButton active={editor.isActive('bold')} onPress={() => editor.chain().focus().toggleBold().run()} label="In đậm">
                  <RiBold size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive('italic')} onPress={() => editor.chain().focus().toggleItalic().run()} label="In nghiêng">
                  <RiItalic size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive('underline')} onPress={() => editor.chain().focus().toggleUnderline().run()} label="Gạch chân">
                  <RiUnderline size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive('strike')} onPress={() => editor.chain().focus().toggleStrike().run()} label="Gạch ngang">
                  <RiStrikethrough size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive('bulletList')} onPress={() => editor.chain().focus().toggleBulletList().run()} label="Danh sách">
                  <RiListUnordered size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive('orderedList')} onPress={() => editor.chain().focus().toggleOrderedList().run()} label="Danh sách số">
                  <RiListOrdered size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive('blockquote')} onPress={() => editor.chain().focus().toggleBlockquote().run()} label="Trích dẫn">
                  <RiDoubleQuotesL size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive({ textAlign: 'left' })} onPress={() => editor.chain().focus().setTextAlign('left').run()} label="Căn trái">
                  <RiAlignLeft size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive({ textAlign: 'center' })} onPress={() => editor.chain().focus().setTextAlign('center').run()} label="Căn giữa">
                  <RiAlignCenter size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive({ textAlign: 'right' })} onPress={() => editor.chain().focus().setTextAlign('right').run()} label="Căn phải">
                  <RiAlignRight size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton active={editor.isActive({ textAlign: 'justify' })} onPress={() => editor.chain().focus().setTextAlign('justify').run()} label="Căn đều">
                  <RiAlignJustify size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton onPress={setLink} label="Liên kết">
                  <RiLink size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton onPress={insertImage} label="Chèn ảnh">
                  <RiImageAddLine size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton onPress={() => editor.chain().focus().setHorizontalRule().run()} label="Đường kẻ">
                  <RiSeparator size={16} />
                </EditorToolbarButton>
                <TableMenuDropdown editor={editor} />
                <EditorToolbarButton onPress={insertTableOfContents} label="Mục lục">
                  <RiMenu2Line size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton
                  disabled={!editor.can().undo()}
                  onPress={() => editor.chain().focus().undo().run()}
                  label="Hoàn tác"
                >
                  <RiArrowGoBackLine size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton
                  disabled={!editor.can().redo()}
                  onPress={() => editor.chain().focus().redo().run()}
                  label="Làm lại"
                >
                  <RiArrowGoForwardLine size={16} />
                </EditorToolbarButton>
                <EditorToolbarButton onPress={() => setFullscreen((f) => !f)} label="Toàn màn hình">
                  <RiFullscreenLine size={16} />
                </EditorToolbarButton>
              </div>

              <div className="flex flex-wrap items-center gap-1 px-0.5">
                <FontSizeCombobox
                  value={currentFontSize}
                  onChange={(size) => {
                    if (!size) editor.chain().focus().unsetFontSize().run();
                    else editor.chain().focus().setFontSize(size).run();
                  }}
                />
                <Select
                  size="sm"
                  aria-label="Font chữ"
                  selectedKeys={[currentFontFamily]}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v) editor.chain().focus().setFontFamily(v).run();
                  }}
                  className="w-32"
                  classNames={{ trigger: 'h-8 min-h-8 text-xs' }}
                >
                  {FONT_FAMILIES.map((f) => (
                    <SelectItem key={f.key}>{f.label}</SelectItem>
                  ))}
                </Select>
                <ColorPaletteDropdown
                  mode="text"
                  onPick={(color) => editor.chain().focus().setColor(color).run()}
                />
                <ColorPaletteDropdown
                  mode="highlight"
                  onPick={(color) => editor.chain().focus().setHighlight({ color }).run()}
                />
                {editor.isActive('table') && (
                  <ColorPaletteDropdown
                    mode="cell"
                    onPick={(color) => editor.chain().focus().setCellAttribute('backgroundColor', color).run()}
                  />
                )}
              </div>
            </div>
            <ImageBubbleToolbar editor={editor} />
            <TableBubbleToolbar editor={editor} />
          </>
        )}

        {mode === 'code' && editor && (
          <div className="flex items-center justify-between border-b border-[#c3c4c7] bg-[#f6f7f7] px-2 py-1">
            <EditorMenuBar
              editor={editor}
              mode={mode}
              fullscreen={fullscreen}
              onModeChange={(m) => {
                if (m === 'visual') applyCode();
                else setMode('code');
              }}
              onFullscreenToggle={() => setFullscreen((f) => !f)}
              onOpenMedia={() => setMediaOpen(true)}
              onInsertImage={insertImage}
              onSetLink={setLink}
              onInsertToc={insertTableOfContents}
            />
            <Tabs
              size="sm"
              selectedKey={mode}
              onSelectionChange={(k) => {
                if (k === 'visual') applyCode();
                else {
                  setCodeValue(editor?.getHTML() ?? value);
                  setMode('code');
                }
              }}
              classNames={{ tabList: 'gap-0 bg-transparent', tab: 'h-7 min-h-7 px-3 text-xs' }}
            >
              <Tab key="visual" title="Trực quan" />
              <Tab key="code" title="Mã" />
            </Tabs>
          </div>
        )}

        {mode === 'visual' && editor ? (
          <div className={cn('overflow-auto relative', fullscreen && 'flex-1')}>
            <ImageBubbleToolbar editor={editor} />
            <EditorContent editor={editor} />
            <style>{`
              .article-editor-prose p {
                margin-top: 0.5em !important;
                margin-bottom: 0.5em !important;
                line-height: 1.6;
              }
              .article-editor-prose h2,
              .article-editor-prose h3,
              .article-editor-prose h4 {
                margin-top: 1.25em !important;
                margin-bottom: 0.5em !important;
              }
              .article-editor-prose a,
              .article-editor-prose a.article-editor-link {
                color: #2271b1 !important;
                text-decoration: underline !important;
                cursor: pointer;
              }
              .article-editor-prose a:hover {
                color: #135e96 !important;
              }
              .article-editor-prose ul.article-toc {
                list-style: none;
                padding: 1rem 1.25rem;
                margin: 1.5rem 0;
                border-left: 4px solid #2271b1;
                border-radius: 0.25rem;
                background: #f8f9fa;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
              }
              .article-editor-prose ul.article-toc > li:first-child {
                font-size: 1.1em;
                margin-bottom: 0.75rem;
                color: #1d2327;
                border-bottom: 1px solid #dcdcde;
                padding-bottom: 0.5rem;
              }
              .article-editor-prose ul.article-toc li {
                margin: 0.5rem 0;
                line-height: 1.5;
              }
              .article-editor-prose ul.article-toc .ml-4 {
                margin-left: 1rem;
              }
              .article-editor-prose ul.article-toc .ml-8 {
                margin-left: 2rem;
              }
              .article-editor-prose ul.article-toc a {
                color: #2271b1 !important;
                text-decoration: none !important;
                font-weight: 500;
              }
              .article-editor-prose ul.article-toc a:hover {
                text-decoration: underline !important;
              }
              .article-editor-prose img.ProseMirror-selectednode {
                outline: 2px solid #68cef8;
                resize: both;
                overflow: auto;
              }
              .article-editor-prose table {
                border-collapse: collapse;
                table-layout: fixed;
                width: auto;
                margin: 0;
                overflow: hidden;
              }
              .article-editor-prose table td,
              .article-editor-prose table th {
                min-width: 1em;
                border: 1px solid #000000;
                padding: 0.5rem;
                vertical-align: top;
                box-sizing: border-box;
                position: relative;
              }
              .article-editor-prose table th {
                font-weight: bold;
                background-color: #f1f3f5;
              }
              .article-editor-prose table .column-resize-handle {
                position: absolute;
                right: -2px;
                top: 0;
                bottom: -2px;
                width: 4px;
                background-color: #68cef8;
                pointer-events: none;
              }
              .article-editor-prose table .selectedCell:after {
                z-index: 2;
                position: absolute;
                content: "";
                left: 0; right: 0; top: 0; bottom: 0;
                background: rgba(34, 113, 177, 0.2);
                pointer-events: none;
              }
            `}</style>
          </div>
        ) : mode === 'code' ? (
          <div className="p-2 space-y-2">
            <Textarea
              minRows={12}
              value={codeValue}
              onValueChange={setCodeValue}
              classNames={{ input: 'font-mono text-xs' }}
              placeholder="HTML nội dung..."
            />
            <Button size="sm" color="primary" onPress={applyCode}>
              Áp dụng HTML
            </Button>
          </div>
        ) : (
          <div className="min-h-[320px] flex items-center justify-center text-sm text-[#50575e]">Đang tải trình soạn thảo…</div>
        )}

        {editor && mode === 'visual' && (
          <div className="border-t border-[#c3c4c7] bg-[#f6f7f7] px-3 py-1.5 text-xs text-[#50575e]">
            Số từ: {editor.storage.characterCount.words()}
          </div>
        )}

        <MediaPickerModal isOpen={mediaOpen} onClose={() => setMediaOpen(false)} onInsert={insertAsset} />
      </div>
    );
  },
);
