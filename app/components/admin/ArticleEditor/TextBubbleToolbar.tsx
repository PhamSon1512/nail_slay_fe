import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiBold,
  RiItalic,
  RiUnderline,
  RiStrikethrough,
  RiLink,
  RiHeading,
} from 'react-icons/ri';
import { ColorPaletteDropdown } from './ColorPaletteDropdown';
import { EditorToolbarButton } from './EditorToolbarButton';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';

type TextBubbleToolbarProps = {
  editor: Editor;
  onOpenLinkModal: () => void;
};

export function TextBubbleToolbar({ editor, onOpenLinkModal }: TextBubbleToolbarProps) {
  if (!editor) return null;

  const toggleHeading = (level: 2 | 3 | 4) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const getHeadingLabel = () => {
    if (editor.isActive('heading', { level: 2 })) return 'H2';
    if (editor.isActive('heading', { level: 3 })) return 'H3';
    if (editor.isActive('heading', { level: 4 })) return 'H4';
    return 'Đoạn';
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="textBubbleMenu"
      shouldShow={({ state, editor: ed }) => {
        const { selection } = state;
        const { empty } = selection;
        if (empty) return false;
        if (ed.isActive('image') || ed.isActive('table')) return false;
        return true;
      }}
      options={{
        placement: 'top',
        offset: 8,
      }}
      className="flex flex-wrap items-center gap-1 rounded-xl border border-[#c3c4c7] bg-white p-1.5 shadow-xl z-50 dark:bg-[#1d1d1d] dark:border-[#3a3a3a]"
    >
      {/* Heading select */}
      <Dropdown size="sm">
        <DropdownTrigger>
          <Button
            size="sm"
            variant="light"
            className="h-7 min-w-10 px-2 text-xs font-bold text-gray-700 dark:text-gray-200"
            startContent={<RiHeading size={14} />}
          >
            {getHeadingLabel()}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Đổi kiểu heading"
          onAction={(key) => {
            if (key === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              toggleHeading(Number(key) as 2 | 3 | 4);
            }
          }}
          classNames={{ base: 'bg-white dark:bg-[#1d1d1d]' }}
        >
          <DropdownItem key="paragraph">Văn bản thường</DropdownItem>
          <DropdownItem key="2" className="font-bold text-base">Tiêu đề 2 (H2)</DropdownItem>
          <DropdownItem key="3" className="font-semibold text-sm">Tiêu đề 3 (H3)</DropdownItem>
          <DropdownItem key="4" className="font-medium text-xs">Tiêu đề 4 (H4)</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <span className="w-px h-5 bg-[#dcdcde] dark:bg-[#3a3a3a] mx-0.5" />

      {/* Formatting buttons */}
      <EditorToolbarButton
        active={editor.isActive('bold')}
        onPress={() => editor.chain().focus().toggleBold().run()}
        label="In đậm"
      >
        <RiBold size={15} />
      </EditorToolbarButton>

      <EditorToolbarButton
        active={editor.isActive('italic')}
        onPress={() => editor.chain().focus().toggleItalic().run()}
        label="In nghiêng"
      >
        <RiItalic size={15} />
      </EditorToolbarButton>

      <EditorToolbarButton
        active={editor.isActive('underline')}
        onPress={() => editor.chain().focus().toggleUnderline().run()}
        label="Gạch chân"
      >
        <RiUnderline size={15} />
      </EditorToolbarButton>

      <EditorToolbarButton
        active={editor.isActive('strike')}
        onPress={() => editor.chain().focus().toggleStrike().run()}
        label="Gạch ngang"
      >
        <RiStrikethrough size={15} />
      </EditorToolbarButton>

      <span className="w-px h-5 bg-[#dcdcde] dark:bg-[#3a3a3a] mx-0.5" />

      {/* Link */}
      <EditorToolbarButton
        active={editor.isActive('link')}
        onPress={onOpenLinkModal}
        label="Chèn liên kết"
      >
        <RiLink size={15} />
      </EditorToolbarButton>

      <span className="w-px h-5 bg-[#dcdcde] dark:bg-[#3a3a3a] mx-0.5" />

      {/* Alignment */}
      <EditorToolbarButton
        active={editor.isActive({ textAlign: 'left' })}
        onPress={() => editor.chain().focus().setTextAlign('left').run()}
        label="Căn trái"
      >
        <RiAlignLeft size={15} />
      </EditorToolbarButton>

      <EditorToolbarButton
        active={editor.isActive({ textAlign: 'center' })}
        onPress={() => editor.chain().focus().setTextAlign('center').run()}
        label="Căn giữa"
      >
        <RiAlignCenter size={15} />
      </EditorToolbarButton>

      <EditorToolbarButton
        active={editor.isActive({ textAlign: 'right' })}
        onPress={() => editor.chain().focus().setTextAlign('right').run()}
        label="Căn phải"
      >
        <RiAlignRight size={15} />
      </EditorToolbarButton>

      <span className="w-px h-5 bg-[#dcdcde] dark:bg-[#3a3a3a] mx-0.5" />

      {/* Colors */}
      <ColorPaletteDropdown
        mode="text"
        onPick={(color) => editor.chain().focus().setColor(color).run()}
      />
      <ColorPaletteDropdown
        mode="highlight"
        onPick={(color) => editor.chain().focus().setHighlight({ color }).run()}
      />
    </BubbleMenu>
  );
}
