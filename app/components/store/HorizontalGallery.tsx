import type { ReactNode } from 'react';
import { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@heroui/react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { cn } from '~/utils';

type HorizontalGalleryProps = {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  intervalMs?: number;
};

export function HorizontalGallery({
  children,
  className,
  itemClassName = 'basis-[82%] sm:basis-[46%] lg:basis-[31%]',
  intervalMs = 3000,
}: HorizontalGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    duration: 28,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollNext()) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollTo(0);
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, children.length]);

  useEffect(() => {
    if (!emblaApi || children.length <= 1) return;

    const timer = window.setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [emblaApi, children.length, intervalMs]);

  if (!children.length) return null;

  return (
    <div className={cn('relative group', className)}>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 touch-pan-y">
          {children.map((child, index) => (
            <div key={index} className={cn('min-w-0 shrink-0 grow-0', itemClassName)}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {children.length > 1 ? (
        <>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            aria-label="Trước"
            onPress={scrollPrev}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-[#1D1D1D] shadow-md"
          >
            <RiArrowLeftSLine size={20} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            aria-label="Sau"
            onPress={scrollNext}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 text-[#1D1D1D] shadow-md"
          >
            <RiArrowRightSLine size={20} />
          </Button>
        </>
      ) : null}
    </div>
  );
}
