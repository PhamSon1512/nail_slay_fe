import { useState, type ReactNode } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { cn } from '~/utils';

type EditorMetaboxProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

/** WordPress-style collapsible metabox panel */
export function EditorMetabox({ title, children, defaultOpen = true, className }: EditorMetaboxProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn('border border-[#c3c4c7] bg-white shadow-sm', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between border-b border-[#c3c4c7] bg-[#f6f7f7] px-3 py-2.5 text-left hover:bg-[#f0f0f1] transition-colors"
      >
        <span className="text-[13px] font-semibold text-[#1d2327]">{title}</span>
        {open ? (
          <RiArrowUpSLine className="text-[#50575e] shrink-0" size={18} />
        ) : (
          <RiArrowDownSLine className="text-[#50575e] shrink-0" size={18} />
        )}
      </button>
      {open ? <div className="p-3 text-sm text-[#2c3338]">{children}</div> : null}
    </div>
  );
}
