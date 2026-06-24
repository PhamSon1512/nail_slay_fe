import type { Editor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCodeSSlashLine,
  RiFileCopyLine,
  RiFullscreenLine,
  RiImageAddLine,
  RiLink,
  RiScissorsCutLine,
  RiSeparator,
  RiTableLine,
} from 'react-icons/ri';
import { cn } from '~/utils';
import { TableInsertGrid } from './TableInsertGrid';

type EditorMenuBarProps = {
  editor: Editor;
  mode: 'visual' | 'code';
  fullscreen: boolean;
  onModeChange: (mode: 'visual' | 'code') => void;
  onFullscreenToggle: () => void;
  onOpenMedia: () => void;
  onInsertImage: () => void;
  onSetLink: () => void;
  onInsertToc: () => void;
};

type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
  submenu?: MenuItem[];
  gridInsert?: boolean;
};

function MenuDropdown({
  label,
  items,
  editor,
  onTableInsert,
}: {
  label: string;
  items: MenuItem[];
  editor: Editor;
  onTableInsert?: (rows: number, cols: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setHoverId(null);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const renderSub = (sub: MenuItem[]) => (
    <div className="min-w-[220px] py-1 bg-white border border-[#c3c4c7] rounded shadow-lg">
      {sub.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          className={cn(
            'flex w-full items-center justify-between px-3 py-1.5 text-sm',
            item.disabled ? 'text-[#a7aaad]' : 'text-[#2c3338] hover:bg-primary-50',
          )}
          onClick={() => {
            item.onClick?.();
            setOpen(false);
          }}
        >
          <span className="flex items-center gap-2">
            {item.checked && <span className="text-primary-600">✓</span>}
            {item.icon}
            {item.label}
          </span>
          {item.shortcut && <span className="text-xs text-[#a7aaad]">{item.shortcut}</span>}
        </button>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className={cn(
          'flex items-center gap-0.5 px-1.5 py-0.5 text-[12px] rounded hover:bg-[#e8e8e8]',
          open && 'bg-[#e8e8e8] ring-1 ring-primary-400',
        )}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <RiArrowDownSLine size={12} className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-0.5 flex items-start"
          onMouseLeave={() => {
            window.setTimeout(() => setHoverId(null), 200);
          }}
        >
          <div className="min-w-[240px] py-1 bg-white border border-[#c3c4c7] rounded shadow-lg">
            {items.map((item) => {
              if (item.id.startsWith('sep-')) {
                return <div key={item.id} className="my-1 border-t border-[#dcdcde]" />;
              }
              const hasSub = Boolean(item.submenu?.length || item.gridInsert);
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => hasSub && !item.disabled && setHoverId(item.id)}
                >
                  <button
                    type="button"
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-1.5 text-sm text-left',
                      item.disabled ? 'text-[#a7aaad]' : 'text-[#2c3338] hover:bg-primary-50',
                      hoverId === item.id && !item.disabled && 'bg-primary-50',
                    )}
                    onClick={() => {
                      if (!hasSub && item.onClick) {
                        item.onClick();
                        setOpen(false);
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    <span className="flex items-center gap-2">
                      {item.shortcut && <span className="text-xs text-[#a7aaad]">{item.shortcut}</span>}
                      {hasSub && <RiArrowRightSLine size={14} />}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          {hoverId === 'table-insert' && onTableInsert && (
            <div
              className="bg-white border border-[#c3c4c7] rounded shadow-lg -ml-px pl-1"
              onMouseEnter={() => setHoverId('table-insert')}
            >
              <TableInsertGrid onInsert={(r, c) => { onTableInsert(r, c); setOpen(false); }} />
            </div>
          )}
          {items.find((i) => i.id === hoverId)?.submenu && (
            <div className="-ml-px pl-1" onMouseEnter={() => setHoverId(hoverId)}>
              {renderSub(items.find((i) => i.id === hoverId)!.submenu!)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function EditorMenuBar({
  editor,
  mode,
  fullscreen,
  onModeChange,
  onFullscreenToggle,
  onOpenMedia,
  onInsertImage,
  onSetLink,
  onInsertToc,
}: EditorMenuBarProps) {
  const editItems: MenuItem[] = [
    { id: 'undo', label: 'Hoàn tác', shortcut: 'Ctrl+Z', disabled: !editor.can().undo(), onClick: () => editor.chain().focus().undo().run() },
    { id: 'redo', label: 'Làm lại', shortcut: 'Ctrl+Y', disabled: !editor.can().redo(), onClick: () => editor.chain().focus().redo().run() },
    { id: 'sep-1', label: '' },
    { id: 'cut', label: 'Cắt', icon: <RiScissorsCutLine size={14} />, shortcut: 'Ctrl+X', onClick: () => document.execCommand('cut') },
    { id: 'copy', label: 'Sao chép', icon: <RiFileCopyLine size={14} />, shortcut: 'Ctrl+C', onClick: () => document.execCommand('copy') },
    { id: 'paste', label: 'Dán', shortcut: 'Ctrl+V', onClick: () => document.execCommand('paste') },
    { id: 'paste-text', label: 'Dán như văn bản', onClick: () => navigator.clipboard.readText().then((t) => editor.chain().focus().insertContent(t).run()) },
    { id: 'sep-2', label: '' },
    { id: 'select-all', label: 'Chọn tất cả', shortcut: 'Ctrl+A', onClick: () => editor.chain().focus().selectAll().run() },
    { id: 'sep-3', label: '' },
    { id: 'find', label: 'Tìm và thay thế', shortcut: 'Ctrl+F', onClick: () => window.alert('Tính năng tìm/thay thế sẽ bổ sung sau.') },
  ];

  const viewItems: MenuItem[] = [
    { id: 'source', label: 'Mã nguồn', icon: <RiCodeSSlashLine size={14} />, onClick: () => onModeChange('code') },
    { id: 'sep-v1', label: '' },
    { id: 'visual', label: 'Hình minh họa', checked: mode === 'visual', onClick: () => onModeChange('visual') },
    { id: 'sep-v2', label: '' },
    { id: 'fullscreen', label: 'Toàn màn hình', icon: <RiFullscreenLine size={14} />, shortcut: 'Ctrl+Shift+F', onClick: onFullscreenToggle },
  ];

  const insertItems: MenuItem[] = [
    { id: 'image', label: 'Hình ảnh', icon: <RiImageAddLine size={14} />, onClick: onInsertImage },
    { id: 'link', label: 'Thêm/sửa đường dẫn', icon: <RiLink size={14} />, onClick: onSetLink },
    { id: 'media', label: 'Thư viện', onClick: onOpenMedia },
    { id: 'table-insert', label: 'Bảng', icon: <RiTableLine size={14} />, gridInsert: true },
    { id: 'sep-i1', label: '' },
    { id: 'hr', label: 'Đường ngang', icon: <RiSeparator size={14} />, onClick: () => editor.chain().focus().setHorizontalRule().run() },
    { id: 'sep-i2', label: '' },
    { id: 'file', label: 'Thêm tệp', onClick: onOpenMedia },
    { id: 'toc', label: 'Chèn mục lục (TOC)', onClick: onInsertToc },
  ];

  const formatItems: MenuItem[] = [
    { id: 'bold', label: 'In đậm', shortcut: 'Ctrl+B', onClick: () => editor.chain().focus().toggleBold().run() },
    { id: 'italic', label: 'In nghiêng', shortcut: 'Ctrl+I', onClick: () => editor.chain().focus().toggleItalic().run() },
    { id: 'underline', label: 'Gạch chân', shortcut: 'Ctrl+U', onClick: () => editor.chain().focus().toggleUnderline().run() },
    { id: 'strike', label: 'Gạch ngang', onClick: () => editor.chain().focus().toggleStrike().run() },
    { id: 'sep-f1', label: '' },
    {
      id: 'blocks',
      label: 'Kiểu đoạn',
      submenu: [
        { id: 'p', label: 'Đoạn văn', onClick: () => editor.chain().focus().setParagraph().run() },
        { id: 'h1', label: 'Heading 1', onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
        { id: 'h2', label: 'Heading 2', onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { id: 'h3', label: 'Heading 3', onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { id: 'h4', label: 'Heading 4', onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
      ],
    },
    { id: 'sep-f2', label: '' },
    { id: 'clear', label: 'Xóa định dạng', onClick: () => editor.chain().focus().unsetAllMarks().clearNodes().run() },
  ];

  const onTableInsert = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
  };

  return (
    <div className="hidden sm:flex items-center gap-1 text-[12px] text-[#50575e]">
      <MenuDropdown label="Chỉnh sửa" items={editItems} editor={editor} />
      <MenuDropdown label="Xem" items={viewItems} editor={editor} />
      <MenuDropdown label="Chèn" items={insertItems} editor={editor} onTableInsert={onTableInsert} />
      <MenuDropdown label="Định dạng" items={formatItems} editor={editor} />
    </div>
  );
}
