import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { RiArrowLeftLine } from 'react-icons/ri';

type InfoPageLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function InfoPageLayout({ title, subtitle, children }: InfoPageLayoutProps) {
  return (
    <div className="container py-10 md:py-14">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[#8E8A8A] hover:text-[#F2A7B7] transition-colors mb-6"
      >
        <RiArrowLeftLine size={16} />
        Về trang chủ
      </Link>

      <header className="max-w-3xl mb-8 md:mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-sm md:text-base text-[#8E8A8A] dark:text-[#FFDDE5] leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </header>

      <div className="max-w-3xl prose prose-sm md:prose-base prose-headings:font-heading prose-headings:text-[#1D1D1D] dark:prose-headings:text-[#FFF3F5] prose-p:text-[#1D1D1D]/90 dark:prose-p:text-[#FFDDE5]/90 prose-li:text-[#1D1D1D]/90 dark:prose-li:text-[#FFDDE5]/90 prose-strong:text-[#1D1D1D] dark:prose-strong:text-[#FFF3F5] prose-a:text-[#F2A7B7] prose-a:no-underline hover:prose-a:underline">
        {children}
      </div>
    </div>
  );
}
