import { useEffect, useRef, useState } from 'react';
import { cn } from '~/utils';

const PRESET_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96];
const DEFAULT_SIZE = 11;

type FontSizeComboboxProps = {
  value: string | null;
  onChange: (sizePt: string | null) => void;
};

function parsePt(value: string | null): number {
  if (!value) return DEFAULT_SIZE;
  const n = parseInt(value.replace(/pt$/i, ''), 10);
  return Number.isFinite(n) ? n : DEFAULT_SIZE;
}

export function FontSizeCombobox({ value, onChange }: FontSizeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(String(parsePt(value)));
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInput(String(parsePt(value)));
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const applySize = (n: number) => {
    if (n < 1 || n > 400) return;
    const pt = `${n}pt`;
    onChange(pt);
    setInput(String(n));
    setOpen(false);
  };

  const onInputBlur = () => {
    const raw = input.replace(/\D/g, '');
    if (!raw) {
      setInput(String(DEFAULT_SIZE));
      onChange(null);
      return;
    }
    applySize(parseInt(raw, 10));
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex h-8 items-center rounded-md border border-[#c3c4c7] bg-white overflow-hidden">
        <input
          aria-label="Cỡ chữ"
          className="w-10 px-1.5 text-xs text-center outline-none border-0"
          value={input}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            setInput(digits);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onInputBlur();
            }
          }}
          onBlur={onInputBlur}
        />
        <button
          type="button"
          className="px-1 text-[10px] text-[#50575e] border-l border-[#c3c4c7] h-full hover:bg-[#f0f0f1]"
          onClick={() => setOpen((o) => !o)}
        >
          ▾
        </button>
      </div>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 max-h-48 w-16 overflow-y-auto rounded border border-[#c3c4c7] bg-white shadow-md py-1">
          {PRESET_SIZES.map((n) => (
            <button
              key={n}
              type="button"
              className={cn(
                'block w-full px-2 py-1 text-left text-xs hover:bg-primary-100',
                parsePt(value) === n && 'bg-primary-50 font-semibold',
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                applySize(n);
              }}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
