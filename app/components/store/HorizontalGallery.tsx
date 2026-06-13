import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@heroui/react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { cn } from '~/utils';

type HorizontalGalleryProps = {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  intervalMs?: number;
  pauseOnHover?: boolean;
};

const MIN_LOOP_SLIDES = 8;

function buildLoopSlides(children: ReactNode[], minSlides = MIN_LOOP_SLIDES) {
  if (children.length === 0) return [];
  if (children.length >= minSlides) return children;

  const slides: ReactNode[] = [];
  for (let i = 0; slides.length < minSlides; i += 1) {
    slides.push(children[i % children.length]);
  }
  return slides;
}

export function HorizontalGallery({
  children,
  className,
  itemClassName = 'basis-[82%] sm:basis-[46%] lg:basis-[31%]',
  intervalMs = 3000,
  pauseOnHover = true,
}: HorizontalGalleryProps) {
  const [paused, setPaused] = useState(false);
  const slides = useMemo(() => buildLoopSlides(children), [children]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    duration: 28,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, slides.length]);

  useEffect(() => {
    if (!emblaApi || slides.length <= 1 || (pauseOnHover && paused)) return;

    const timer = window.setInterval(() => {
      emblaApi.scrollNext();
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [emblaApi, slides.length, intervalMs, paused, pauseOnHover]);

  if (!children.length) return null;

  return (
    <div
      className={cn('relative group', className)}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 touch-pan-y">
          {slides.map((child, index) => (
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
