import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
  RiAlignCenter,
  RiAlignLeft,
  RiAlignRight,
  RiBold,
  RiItalic,
  RiUnderline,
  RiDeleteBinLine,
  RiPaintFill,
  RiLayoutRowLine,
  RiLayoutColumnLine,
} from 'react-icons/ri';
import { ColorPaletteDropdown } from './ColorPaletteDropdown';
import { EditorToolbarButton } from './EditorToolbarButton';

type TableBubbleToolbarProps = {
  editor: Editor;
};

export function TableBubbleToolbar({ editor }: TableBubbleToolbarProps) {
  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="tableBubbleMenu"
      shouldShow={({ editor: ed }) => ed.isActive('table')}
      options={{
        placement: 'top',
        offset: 8,
      }}
      getReferencedVirtualElement={() => {
        const { view, state } = editor;
        const { selection } = state;
        const { $from } = selection;

        // Method 1: Tiptap / Prosemirror node resolution (most accurate)
        for (let depth = $from.depth; depth > 0; depth--) {
          if ($from.node(depth).type.name === 'table') {
            const pos = $from.before(depth);
            const dom = view.nodeDOM(pos) as HTMLElement;
            if (dom && dom.nodeType === 1) {
              return dom; // Element satisfies VirtualElement in Floating UI
            }
          }
        }

        // Method 2: Native DOM selection fallback
        try {
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0);
            const container = range.startContainer;
            const element = container.nodeType === 1 ? (container as Element) : container.parentElement;
            const table = element?.closest('table');
            if (table) {
              return table;
            }
          }
        } catch (e) {
          // ignore
        }

        // Return null to use default selection positioning
        return null;
      }}
      className="flex flex-wrap max-w-[320px] items-center gap-1 rounded border border-[#c3c4c7] bg-white px-2 py-1 shadow-xl z-50"
    >
      <EditorToolbarButton active={editor.isActive('bold')} onPress={() => editor.chain().focus().toggleBold().run()} label="In đậm">
        <RiBold size={16} />
      </EditorToolbarButton>
      <EditorToolbarButton active={editor.isActive('italic')} onPress={() => editor.chain().focus().toggleItalic().run()} label="In nghiêng">
        <RiItalic size={16} />
      </EditorToolbarButton>
      <EditorToolbarButton active={editor.isActive('underline')} onPress={() => editor.chain().focus().toggleUnderline().run()} label="Gạch chân">
        <RiUnderline size={16} />
      </EditorToolbarButton>

      <span className="w-px h-5 bg-[#dcdcde] mx-0.5" />

      <EditorToolbarButton active={editor.isActive({ textAlign: 'left' })} onPress={() => editor.chain().focus().setTextAlign('left').run()} label="Căn trái">
        <RiAlignLeft size={16} />
      </EditorToolbarButton>
      <EditorToolbarButton active={editor.isActive({ textAlign: 'center' })} onPress={() => editor.chain().focus().setTextAlign('center').run()} label="Căn giữa">
        <RiAlignCenter size={16} />
      </EditorToolbarButton>
      <EditorToolbarButton active={editor.isActive({ textAlign: 'right' })} onPress={() => editor.chain().focus().setTextAlign('right').run()} label="Căn phải">
        <RiAlignRight size={16} />
      </EditorToolbarButton>

      <span className="w-px h-5 bg-[#dcdcde] mx-0.5" />

      <ColorPaletteDropdown
        mode="text"
        onPick={(color) => editor.chain().focus().setColor(color).run()}
      />
      <ColorPaletteDropdown
        mode="highlight"
        onPick={(color) => editor.chain().focus().setHighlight({ color }).run()}
      />
      <ColorPaletteDropdown
        mode="cell"
        onPick={(color) => editor.chain().focus().setCellAttribute('backgroundColor', color).run()}
      />

      <span className="w-px h-5 bg-[#dcdcde] mx-0.5" />

      <EditorToolbarButton disabled={!editor.can().mergeCells()} onPress={() => editor.chain().focus().mergeCells().run()} label="Gộp ô">
        <span className="text-[10px] font-bold">Gộp</span>
      </EditorToolbarButton>
      <EditorToolbarButton disabled={!editor.can().splitCell()} onPress={() => editor.chain().focus().splitCell().run()} label="Chia ô">
        <span className="text-[10px] font-bold">Chia</span>
      </EditorToolbarButton>

      <span className="w-px h-5 bg-[#dcdcde] mx-0.5" />

      <EditorToolbarButton onPress={() => editor.chain().focus().deleteTable().run()} label="Xóa bảng">
        <RiDeleteBinLine size={16} className="text-danger" />
      </EditorToolbarButton>
    </BubbleMenu>
  );
}
