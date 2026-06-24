import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiCloseLine,
  RiEditLine,
  RiLayoutColumnLine,
} from 'react-icons/ri';
import type { ImageAlign } from './extensions/resizableImage';

type ImageBubbleToolbarProps = {
  editor: Editor;
};

export function ImageBubbleToolbar({ editor }: ImageBubbleToolbarProps) {
  const setAlign = (align: ImageAlign) => {
    editor.chain().focus().updateAttributes('image', { align }).run();
  };

  const setWidth = (pct: number) => {
    const editorEl = document.querySelector('.ProseMirror');
    const containerWidth = editorEl?.clientWidth ?? 600;
    const width = Math.round((containerWidth * pct) / 100);
    editor.chain().focus().updateAttributes('image', { width: String(width) }).run();
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: ed }) => ed.isActive('image')}
      className="flex items-center gap-0.5 rounded border border-[#c3c4c7] bg-white px-1 py-0.5 shadow-md"
    >
      <ToolbarIcon label="Căn trái" onPress={() => setAlign('left')}>
        <RiAlignLeft size={16} />
      </ToolbarIcon>
      <ToolbarIcon label="Căn giữa" onPress={() => setAlign('center')}>
        <RiAlignCenter size={16} />
      </ToolbarIcon>
      <ToolbarIcon label="Căn phải" onPress={() => setAlign('right')}>
        <RiAlignRight size={16} />
      </ToolbarIcon>
      <ToolbarIcon label="Toàn chiều rộng" onPress={() => setAlign('full')}>
        <RiLayoutColumnLine size={16} />
      </ToolbarIcon>
      <span className="w-px h-5 bg-[#dcdcde] mx-0.5" />
      <ToolbarIcon label="50%" onPress={() => setWidth(50)}>
        <span className="text-[10px] font-bold">50%</span>
      </ToolbarIcon>
      <ToolbarIcon label="75%" onPress={() => setWidth(75)}>
        <span className="text-[10px] font-bold">75%</span>
      </ToolbarIcon>
      <ToolbarIcon label="100%" onPress={() => setWidth(100)}>
        <span className="text-[10px] font-bold">100%</span>
      </ToolbarIcon>
      <span className="w-px h-5 bg-[#dcdcde] mx-0.5" />
      <ToolbarIcon
        label="Sửa alt"
        onPress={() => {
          const alt = window.prompt('Mô tả ảnh (alt)', editor.getAttributes('image').alt ?? '');
          if (alt !== null) editor.chain().focus().updateAttributes('image', { alt }).run();
        }}
      >
        <RiEditLine size={16} />
      </ToolbarIcon>
      <ToolbarIcon label="Xóa ảnh" onPress={() => editor.chain().focus().deleteSelection().run()}>
        <RiCloseLine size={16} />
      </ToolbarIcon>
    </BubbleMenu>
  );
}

function ToolbarIcon({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#e8e8e8] text-[#50575e]"
      onClick={onPress}
    >
      {children}
    </button>
  );
}
