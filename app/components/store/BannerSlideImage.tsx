import { cn } from '~/utils';

type BannerSlideImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/** Full banner image always visible (object-contain); blurred fill for letterboxing. */
export function BannerSlideImage({ src, alt, className }: BannerSlideImageProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        'h-[clamp(200px,52vw,280px)] sm:h-[clamp(240px,45vw,380px)] md:h-[min(70vh,560px)]',
        className,
      )}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl opacity-40 pointer-events-none select-none sm:blur-2xl sm:opacity-50"
      />
      <img
        key={src}
        src={src}
        alt={alt}
        className="relative z-10 mx-auto block h-full w-full object-contain object-center"
      />
    </div>
  );
}
