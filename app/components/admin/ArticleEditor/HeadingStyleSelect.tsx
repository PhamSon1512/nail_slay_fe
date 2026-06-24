import { useEffect, useRef, useState } from 'react';
import { cn } from '~/utils';

const OPTIONS = [
  { key: 'paragraph', label: 'Đoạn văn', previewClass: 'text-[11pt] font-normal text-[#2c3338]' },
  { key: '1', label: 'Heading 1', previewClass: 'text-2xl font-bold text-[#1d2327]' },
  { key: '2', label: 'Heading 2', previewClass: 'text-xl font-bold text-[#1d2327]' },
  { key: '3', label: 'Heading 3', previewClass: 'text-lg font-semibold text-[#1d2327]' },
  { key: '4', label: 'Heading 4', previewClass: 'text-base font-semibold text-[#1d2327]' },
] as const;

type HeadingStyleSelectProps = {
  value: string;
  onChange: (key: string) => void;
};

export function HeadingStyleSelect({ value, onChange }: HeadingStyleSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.key === value) ?? OPTIONS[0];

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div ref={ref} className="relative min-w-[120px]">
      <button
        type="button"
        className="flex h-8 w-full items-center justify-between rounded-md border border-[#c3c4c7] bg-white px-2 text-xs text-[#2c3338] hover:bg-[#f6f7f7]"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={cn('truncate', current.previewClass)}>{current.label}</span>
        <span className="text-[#50575e] ml-1">▾</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 w-56 rounded border border-[#c3c4c7] bg-white shadow-lg py-1">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              className={cn(
                'flex w-full items-center px-3 py-2 text-left hover:bg-primary-50',
                value === o.key && 'bg-primary-50',
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(o.key);
                setOpen(false);
              }}
            >
              <span className={o.previewClass}>{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
