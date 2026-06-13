import { cn } from '~/utils';

export type BrandLogoFrameProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  /** Tailwind size preset — override with className if needed */
  size?: 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: number;
  /** Scale logo artwork inside frame (useful when PNG has extra transparent padding) */
  imageScale?: number;
  shadow?: 'soft' | 'rose' | 'none';
};

const SIZE_CLASS = {
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40 md:w-44 md:h-44',
  '2xl': 'w-48 h-48 md:w-56 md:h-56',
  hero: 'w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 lg:w-72 lg:h-72',
} as const;

const SHADOW_CLASS = {
  soft: 'shadow-[0_4px_20px_rgba(195,109,128,0.18)]',
  rose: 'shadow-[0_8px_36px_rgba(242,167,183,0.38)]',
  none: '',
} as const;

export function BrandLogoFrame({
  src,
  alt,
  className,
  imageClassName,
  size = 'lg',
  borderWidth = 2,
  borderColor = 'rgba(242, 167, 183, 0.45)',
  backgroundColor = '#FFFFFF',
  borderRadius = '9999px',
  padding = 10,
  imageScale = 1.2,
  shadow = 'rose',
}: BrandLogoFrameProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden',
        SIZE_CLASS[size],
        SHADOW_CLASS[shadow],
        className,
      )}
      style={{
        borderWidth,
        borderStyle: 'solid',
        borderColor,
        borderRadius,
        backgroundColor,
        padding,
      }}
    >
      <img
        src={src}
        alt={alt}
        className={cn('h-full w-full object-contain', imageClassName)}
        style={{ transform: `scale(${imageScale})` }}
      />
    </div>
  );
}
