import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Card, CardBody } from '@heroui/react';
import { BRAND } from '~/data';

type AuthFormLayoutProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthFormLayout({ title, subtitle, children, footer }: AuthFormLayoutProps) {
  return (
    <div className="container py-12 md:py-16 flex justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex flex-col items-center gap-3 group">
            <img
              src={BRAND.assets.logo}
              alt={BRAND.name}
              className="brand-logo-ring !w-16 !h-16 md:!w-20 md:!h-20 transition-transform group-hover:scale-105"
            />
            <span className="brand-name text-3xl md:text-4xl">{BRAND.name}</span>
          </Link>
          {subtitle ? (
            <p className="text-sm text-[#8E8A8A] dark:text-[#FFDDE5]">{subtitle}</p>
          ) : null}
        </div>

        <Card shadow="sm" className="border border-primary-200/70 bg-white/90 dark:bg-[#2a2226]">
          <CardBody className="gap-5 p-6 md:p-8">
            <h1 className="font-heading text-2xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5] text-center">
              {title}
            </h1>
            {children}
          </CardBody>
        </Card>

        {footer ? <div className="text-center text-sm">{footer}</div> : null}
      </div>
    </div>
  );
}
