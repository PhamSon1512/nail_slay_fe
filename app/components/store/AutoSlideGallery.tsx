import type { ReactNode } from 'react';
import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@heroui/react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { cn } from '~/utils';

type AutoSlideGalleryProps = {
  children: ReactNode[];
  className?: string;
  slideClassName?: string;
  intervalMs?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
};

export function AutoSlideGallery({
  children,
  className,
  slideClassName,
  intervalMs = 3000,
  showArrows = true,
  showDots = true,
  loop = true,
}: AutoSlideGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: 'start' });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi || children.length <= 1) return;

    const timer = window.setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else if (loop) {
        emblaApi.scrollTo(0);
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [emblaApi, children.length, intervalMs, loop]);

  if (!children.length) return null;

  return (
    <div className={cn('relative group', className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {children.map((child, index) => (
            <div
              key={index}
              className={cn('min-w-0 shrink-0 grow-0 basis-full', slideClassName)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && children.length > 1 ? (
        <>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            aria-label="Slide trước"
            onPress={scrollPrev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1D1D1D] shadow-md opacity-90 sm:opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity min-w-9 min-h-9"
          >
            <RiArrowLeftSLine size={20} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            aria-label="Slide sau"
            onPress={scrollNext}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1D1D1D] shadow-md opacity-90 sm:opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity min-w-9 min-h-9"
          >
            <RiArrowRightSLine size={20} />
          </Button>
        </>
      ) : null}

      {showDots && children.length > 1 ? (
        <div className="absolute bottom-4 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-1.5 z-20">
          {children.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className="w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
