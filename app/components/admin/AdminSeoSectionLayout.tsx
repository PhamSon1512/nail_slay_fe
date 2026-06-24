import type { ReactNode } from 'react';
import { Link } from 'react-router';

type AdminSeoSectionLayoutProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/** Shared layout for pages under Bài viết - SEO menu group */
export function AdminSeoSectionLayout({ title, description, actions, children }: AdminSeoSectionLayoutProps) {
  return (
    <div className="pb-12 -m-4 md:-m-6">
      <div className="bg-[#f0f0f1] border-b border-[#c3c4c7] px-4 md:px-6 py-3">
        <p className="text-xs text-[#50575e] mb-1">
          <Link to="/admin/articles" className="text-primary-600 hover:underline">
            Bài viết - SEO
          </Link>
          <span className="mx-1">›</span>
          <span>{title}</span>
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[23px] font-normal text-[#1d2327]">{title}</h1>
            {description ? <p className="text-sm text-[#50575e] mt-0.5">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
      <div className="px-4 md:px-6 py-4">{children}</div>
    </div>
  );
}
