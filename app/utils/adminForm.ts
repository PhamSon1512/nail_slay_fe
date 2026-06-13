/** Shared HeroUI classNames for admin forms on pink backgrounds. */
export const adminInputClassNames = {
  label: 'text-[#1D1D1D] dark:text-[#FFF3F5] font-medium',
  input: 'text-[#1D1D1D] dark:text-[#FFF3F5] placeholder:text-[#8E8A8A]',
  inputWrapper:
    'bg-white dark:bg-[#2a2226] border border-primary-200/80 shadow-sm data-[hover=true]:bg-white dark:data-[hover=true]:bg-[#2a2226]',
};

export const adminSelectClassNames = {
  label: 'text-[#1D1D1D] dark:text-[#FFF3F5] font-medium',
  trigger:
    'bg-white dark:bg-[#2a2226] border border-primary-200/80 text-[#1D1D1D] dark:text-[#FFF3F5] data-[hover=true]:bg-white',
  value: 'text-[#1D1D1D] dark:text-[#FFF3F5]',
  listbox: 'text-[#1D1D1D]',
  popoverContent: 'bg-white dark:bg-[#2a2226] border border-primary-200/80',
};

export const adminTextareaClassNames = {
  ...adminInputClassNames,
};

export const adminTableClassNames = {
  th: 'bg-white dark:bg-[#2a2226] text-xs text-[#8E8A8A] font-semibold uppercase tracking-wider',
  td: 'py-3 text-sm text-[#1D1D1D] dark:text-[#FFF3F5]',
};

export const adminCardClass = 'border border-primary-200/70 bg-white dark:bg-[#2a2226]';
