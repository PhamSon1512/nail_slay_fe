import type { Editor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiTableLine,
} from 'react-icons/ri';
import { cn } from '~/utils';
import { TableInsertGrid } from './TableInsertGrid';

type TableMenuDropdownProps = {
  editor: Editor;
};

type SubItem = {
  id: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
};

function SubMenuPanel({
  items,
  onClose,
}: {
  items: SubItem[];
  onClose: () => void;
}) {
  return (
    <div className="min-w-[200px] py-1 bg-white border border-[#c3c4c7] rounded shadow-lg">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          className={cn(
            'w-full text-left px-3 py-1.5 text-sm',
            item.disabled ? 'text-[#a7aaad] cursor-not-allowed' : 'text-[#2c3338] hover:bg-primary-50',
          )}
          onClick={() => {
            if (!item.disabled && item.onClick) {
              item.onClick();
              onClose();
            }
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function TableMenuDropdown({ editor }: TableMenuDropdownProps) {
  const [open, setOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inTable = editor.isActive('table');
  const canDelete = editor.can().deleteTable();
  const canRow = editor.can().addRowAfter();
  const canCol = editor.can().addColumnAfter();
  const canCell = editor.can().mergeCells();

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const scheduleHoverClear = () => {
    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => setHoverId(null), 400);
  };

  const setHover = (id: string | null) => {
    clearHoverTimer();
    setHoverId(id);
  };

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setHoverId(null);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      clearHoverTimer();
    };
  }, []);

  const cellItems: SubItem[] = [
    { id: 'copy-row', label: 'Sao chép dòng', disabled: !canRow, onClick: () => {} },
    { id: 'merge-col', label: 'Gộp cột', disabled: !canCell, onClick: () => editor.chain().focus().mergeCells().run() },
    { id: 'split', label: 'Chia ô trong bảng', disabled: !editor.can().splitCell(), onClick: () => editor.chain().focus().splitCell().run() },
  ];

  const rowItems: SubItem[] = [
    { id: 'row-before', label: 'Thêm dòng vào trước', disabled: !editor.can().addRowBefore(), onClick: () => editor.chain().focus().addRowBefore().run() },
    { id: 'row-after', label: 'Thêm dòng vào sau', disabled: !editor.can().addRowAfter(), onClick: () => editor.chain().focus().addRowAfter().run() },
    { id: 'row-del', label: 'Xóa dòng', disabled: !editor.can().deleteRow(), onClick: () => editor.chain().focus().deleteRow().run() },
    { id: 'row-copy', label: 'Sao chép dòng', disabled: !canRow, onClick: () => {} },
  ];

  const colItems: SubItem[] = [
    { id: 'col-before', label: 'Thêm cột vào trước', disabled: !editor.can().addColumnBefore(), onClick: () => editor.chain().focus().addColumnBefore().run() },
    { id: 'col-after', label: 'Thêm cột vào sau', disabled: !editor.can().addColumnAfter(), onClick: () => editor.chain().focus().addColumnAfter().run() },
    { id: 'col-del', label: 'Xóa cột', disabled: !editor.can().deleteColumn(), onClick: () => editor.chain().focus().deleteColumn().run() },
  ];

  const mainItems = [
    { id: 'table', label: 'Bảng', icon: <RiTableLine size={14} />, hasSub: true },
    { id: 'display', label: 'Tùy chọn hiển thị bảng', disabled: true },
    { id: 'delete', label: 'Xóa bảng', disabled: !canDelete, onClick: () => editor.chain().focus().deleteTable().run() },
    { id: 'sep', label: '' },
    { id: 'cell', label: 'Ô phần tử', hasSub: true, disabled: !inTable },
    { id: 'row', label: 'Dòng', hasSub: true, disabled: !inTable },
    { id: 'col', label: 'Cột', hasSub: true, disabled: !inTable },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Bảng"
        className={cn(
          'flex h-[30px] items-center rounded-sm border px-1 text-[#50575e] hover:bg-[#e8e8e8]',
          open ? 'border-primary-400 bg-[#e8f0fe]' : 'border-transparent',
        )}
        onClick={() => setOpen((o) => !o)}
      >
        <RiTableLine size={16} />
        <RiArrowDownSLine size={12} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-0.5 flex items-start"
          onMouseLeave={scheduleHoverClear}
        >
          <div className="min-w-[220px] py-1 bg-white border border-[#c3c4c7] rounded shadow-lg">
            {mainItems.map((item) => {
              if (item.id === 'sep') {
                return <div key="sep" className="my-1 border-t border-[#dcdcde]" />;
              }
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => !item.disabled && item.hasSub && setHover(item.id)}
                >
                  <button
                    type="button"
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-1.5 text-sm text-left',
                      item.disabled ? 'text-[#a7aaad]' : 'text-[#2c3338] hover:bg-primary-500 hover:text-white',
                      hoverId === item.id && !item.disabled && 'bg-primary-500 text-white',
                    )}
                    onClick={() => {
                      if (item.onClick) {
                        item.onClick();
                        setOpen(false);
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.label}
                    </span>
                    {item.hasSub && <RiArrowRightSLine size={14} />}
                  </button>
                </div>
              );
            })}
          </div>

          {hoverId === 'table' && (
            <div
              className="bg-white border border-[#c3c4c7] rounded shadow-lg -ml-px pl-1"
              onMouseEnter={() => setHover('table')}
            >
              <TableInsertGrid
                onInsert={(rows, cols) => {
                  editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
                  setOpen(false);
                }}
              />
            </div>
          )}
          {hoverId === 'cell' && (
            <div className="-ml-px pl-1" onMouseEnter={() => setHover('cell')}>
              <SubMenuPanel items={cellItems} onClose={() => setOpen(false)} />
            </div>
          )}
          {hoverId === 'row' && (
            <div className="-ml-px pl-1" onMouseEnter={() => setHover('row')}>
              <SubMenuPanel items={rowItems} onClose={() => setOpen(false)} />
            </div>
          )}
          {hoverId === 'col' && (
            <div className="-ml-px pl-1" onMouseEnter={() => setHover('col')}>
              <SubMenuPanel items={colItems} onClose={() => setOpen(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
