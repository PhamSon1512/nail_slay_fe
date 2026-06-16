import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@heroui/react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { cn } from '~/utils';

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
  intervalMs?: number;
};

export function ProductImageGallery({ images, alt, className, intervalMs = 3500 }: ProductImageGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1, align: 'start' });
  const [thumbRef, thumbApi] = useEmblaCarousel({ containScroll: 'keepSnaps', dragFree: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi?.scrollTo(index);
  }, [emblaApi, thumbApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || images.length <= 1 || isHovered) return;
    const timer = window.setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [emblaApi, images.length, intervalMs, isHovered]);

  if (!images.length) return null;

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
    thumbApi?.scrollTo(index);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className="relative group rounded-3xl overflow-hidden border border-primary-200/70 aspect-square w-full shadow-[0_24px_48px_-12px_rgba(195,109,128,0.35)] hover-3d"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div ref={emblaRef} className="overflow-hidden h-full">
          <div className="flex h-full touch-pan-y">
            {images.map((src, i) => (
              <div key={src + i} className="min-w-0 shrink-0 grow-0 basis-full h-full bg-gradient-hero">
                <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 ? (
          <>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              aria-label="Ảnh trước"
              onPress={() => emblaApi?.scrollPrev()}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1D1D1D] shadow-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <RiArrowLeftSLine size={20} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              aria-label="Ảnh sau"
              onPress={() => emblaApi?.scrollNext()}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1D1D1D] shadow-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <RiArrowRightSLine size={20} />
            </Button>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div ref={thumbRef} className="overflow-hidden w-full">
          <div className="flex gap-2.5 justify-center">
            {images.map((src, i) => (
              <button
                key={`thumb-${src}-${i}`}
                type="button"
                aria-label={`Xem ảnh ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={cn(
                  'shrink-0 w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-xl overflow-hidden border-2 transition-all duration-300',
                  selectedIndex === i
                    ? 'border-primary-500 ring-2 ring-primary-400/50 shadow-lg shadow-primary-200/60 scale-105'
                    : 'border-primary-200/70 opacity-75 hover:opacity-100 hover:scale-105',
                )}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
