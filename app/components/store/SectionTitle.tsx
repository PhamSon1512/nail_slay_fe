import { cn } from '~/utils';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'space-y-2',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.28em] text-[#8E8A8A] font-medium">{eyebrow}</p>
      ) : null}
      <h2 className="section-title">{title}</h2>
      {subtitle ? (
        <p
          className={cn(
            'text-sm md:text-base text-[#8E8A8A] dark:text-[#FFDDE5] max-w-2xl',
            align === 'center' && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
