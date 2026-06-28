import { useCallback, useEffect } from 'react';
import TiptapImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button, Tooltip } from '@heroui/react';
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiH2,
  RiH3,
  RiItalic,
  RiLink,
  RiListOrdered,
  RiListUnordered,
  RiUnderline,
} from 'react-icons/ri';
import { uploadContentImage } from '~/utils/api/admin';
import { cn } from '~/utils';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

function ToolbarButton({
  active,
  onPress,
  children,
  label,
}: {
  active?: boolean;
  onPress: () => void;
  children: import('react').ReactNode;
  label: string;
}) {
  return (
    <Tooltip content={label} placement="top" delay={300} closeDelay={0}>
      <Button
        isIconOnly
        size="sm"
        variant={active ? 'solid' : 'flat'}
        color={active ? 'primary' : 'default'}
        aria-label={label}
        onPress={onPress}
        className="min-w-8 min-h-8"
      >
        {children}
      </Button>
    </Tooltip>
  );
}

export function RichTextEditor({ value, onChange, placeholder = 'Nhập nội dung...', className }: RichTextEditorProps) {
  const uploadAndInsertImage = useCallback(async (file: File, editor: NonNullable<ReturnType<typeof useEditor>>) => {
    try {
      const { url } = await uploadContentImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      // interceptor handles toast
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TiptapImage.configure({ HTMLAttributes: { class: 'max-w-full h-auto my-4 mx-auto rounded-xl' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[280px] px-3 py-3 focus:outline-none [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1.5 [&_p]:my-2 [&_p]:leading-relaxed',
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
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

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

  if (!editor) return null;

  return (
    <div className={cn('rounded-xl border border-primary-200 bg-white dark:bg-[#2a2226] overflow-hidden', className)}>
      <div className="flex flex-wrap gap-1 p-2 border-b border-primary-200/70 bg-[#FFF8FA] dark:bg-[#32282c]">
        <ToolbarButton active={editor.isActive('bold')} onPress={() => editor.chain().focus().toggleBold().run()} label="In đậm">
          <RiBold size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onPress={() => editor.chain().focus().toggleItalic().run()} label="In nghiêng">
          <RiItalic size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('underline')} onPress={() => editor.chain().focus().toggleUnderline().run()} label="Gạch chân">
          <RiUnderline size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 2 })} onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="Tiêu đề H2">
          <RiH2 size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 3 })} onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="Tiêu đề H3">
          <RiH3 size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'left' })} onPress={() => editor.chain().focus().setTextAlign('left').run()} label="Căn trái">
          <RiAlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'center' })} onPress={() => editor.chain().focus().setTextAlign('center').run()} label="Căn giữa">
          <RiAlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'right' })} onPress={() => editor.chain().focus().setTextAlign('right').run()} label="Căn phải">
          <RiAlignRight size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('link')} onPress={setLink} label="Chèn liên kết">
          <RiLink size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onPress={() => editor.chain().focus().toggleBulletList().run()} label="Danh sách gạch đầu dòng">
          <RiListUnordered size={16} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onPress={() => editor.chain().focus().toggleOrderedList().run()} label="Danh sách đánh số">
          <RiListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onPress={() => editor.chain().focus().undo().run()} label="Hoàn tác">
          <span className="text-xs font-semibold">↶</span>
        </ToolbarButton>
        <ToolbarButton onPress={() => editor.chain().focus().redo().run()} label="Làm lại">
          <span className="text-xs font-semibold">↷</span>
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
