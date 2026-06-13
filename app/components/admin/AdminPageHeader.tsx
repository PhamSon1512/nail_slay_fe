import type { ReactNode } from 'react';

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-[#1D1D1D] dark:text-[#FFF3F5]">{title}</h1>
        {description ? <p className="text-sm text-[#8E8A8A] mt-2 font-medium">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2 flex-wrap">{actions}</div> : null}
    </div>
  );
}
