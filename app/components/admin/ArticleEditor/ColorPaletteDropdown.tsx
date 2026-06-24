import { useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine, RiFontColor, RiMarkPenLine, RiPaintFill } from 'react-icons/ri';
import { cn } from '~/utils';
import { DEFAULT_HIGHLIGHT_COLOR, DEFAULT_TEXT_COLOR, EDITOR_COLOR_PALETTE } from './editorColors';

type ColorPaletteDropdownProps = {
  mode: 'text' | 'highlight' | 'cell';
  onPick: (color: string) => void;
};

export function ColorPaletteDropdown({ mode, onPick }: ColorPaletteDropdownProps) {
  const [open, setOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const label = mode === 'text' ? 'Màu chữ văn bản' : mode === 'highlight' ? 'Màu nền' : 'Tô màu ô bảng';

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setCustomOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          'flex min-h-[30px] h-[30px] items-center rounded-sm border px-1 text-[#50575e] hover:bg-[#e8e8e8]',
          open ? 'border-primary-400 bg-[#e8f0fe]' : 'border-transparent',
        )}
        onClick={() => setOpen((o) => !o)}
      >
        {mode === 'text' ? (
          <span className="flex flex-col items-center leading-none">
            <RiFontColor size={15} />
            <span className="h-0.5 w-3.5 bg-[#000] mt-0.5 rounded-sm" />
          </span>
        ) : mode === 'highlight' ? (
          <span className="flex flex-col items-center leading-none">
            <RiMarkPenLine size={15} />
            <span className="h-0.5 w-3.5 bg-[#ffff00] mt-0.5 rounded-sm" />
          </span>
        ) : (
          <span className="flex flex-col items-center leading-none">
            <RiPaintFill size={15} />
            <span className="h-0.5 w-3.5 bg-[#68cef8] mt-0.5 rounded-sm" />
          </span>
        )}
        <RiArrowDownSLine size={12} className="ml-0.5 opacity-70" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[220px] rounded border border-[#c3c4c7] bg-white p-2 shadow-lg">
          <p className="text-xs text-[#50575e] mb-2 font-medium">{label}</p>
          <div className="grid grid-cols-8 gap-0.5">
            {EDITOR_COLOR_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                className={cn(
                  'h-5 w-5 rounded-sm border border-[#c3c4c7] hover:scale-110 transition-transform',
                  color === '#FFFFFF' && 'bg-white',
                )}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onPick(color);
                  setOpen(false);
                }}
              />
            ))}
          </div>
          <button
            type="button"
            className="mt-2 w-full text-left text-xs text-[#50575e] hover:text-primary-600 py-1"
            onClick={() => setCustomOpen((v) => !v)}
          >
            Tùy chỉnh…
          </button>
          {customOpen && (
            <input
              type="color"
              defaultValue={mode === 'text' ? DEFAULT_TEXT_COLOR : DEFAULT_HIGHLIGHT_COLOR}
              className="mt-1 h-8 w-full cursor-pointer rounded border border-[#c3c4c7]"
              onChange={(e) => {
                onPick(e.target.value);
              }}
            />
          )}
          <div className="grid grid-cols-8 gap-0.5 mt-2 pt-2 border-t border-[#dcdcde]">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="h-5 w-5 rounded-sm border border-[#e8e8e8] bg-white" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
