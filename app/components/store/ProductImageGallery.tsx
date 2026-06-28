import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@heroui/react';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { cn } from '~/utils';

export type ProductGallerySlide = {
  src: string;
  kind: 'product' | 'variant';
  variantId?: string;
  variantLabel?: string;
};

type ProductImageGalleryProps = {
  slides: ProductGallerySlide[];
  alt: string;
  className?: string;
  intervalMs?: number;
  selectedIndex?: number;
  onSelectedIndexChange?: (index: number, slide: ProductGallerySlide) => void;
  /** Tắt autoplay từ bên ngoài (vd. click chọn biến thể) */
  pauseAutoplay?: boolean;
};

export function ProductImageGallery({
  slides,
  alt,
  className,
  intervalMs = 3500,
  selectedIndex: controlledIndex,
  onSelectedIndexChange,
  pauseAutoplay = false,
}: ProductImageGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1, align: 'start' });
  const [thumbRef, thumbApi] = useEmblaCarousel({ containScroll: 'keepSnaps', dragFree: true });
  const [internalIndex, setInternalIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const disableAutoplay = useCallback(() => setAutoplayEnabled(false), []);

  const selectedIndex = controlledIndex ?? internalIndex;
  const currentSlide = slides[selectedIndex];
  const firstVariantIndex = slides.findIndex((slide) => slide.kind === 'variant');
  const canAutoplay = autoplayEnabled && !pauseAutoplay;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    if (controlledIndex === undefined) setInternalIndex(index);
    thumbApi?.scrollTo(index);
    const slide = slides[index];
    if (slide) onSelectedIndexChange?.(index, slide);
  }, [controlledIndex, emblaApi, onSelectedIndexChange, slides, thumbApi]);

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
    if (!emblaApi || controlledIndex === undefined) return;
    if (emblaApi.selectedScrollSnap() !== controlledIndex) {
      emblaApi.scrollTo(controlledIndex);
      thumbApi?.scrollTo(controlledIndex);
    }
  }, [controlledIndex, emblaApi, thumbApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onPointerDown = () => disableAutoplay();
    emblaApi.on('pointerDown', onPointerDown);
    return () => emblaApi.off('pointerDown', onPointerDown);
  }, [disableAutoplay, emblaApi]);

  useEffect(() => {
    if (!emblaApi || !canAutoplay || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      if (emblaApi.canScrollNext()) emblaApi.scrollNext();
      else emblaApi.scrollTo(0);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [canAutoplay, emblaApi, slides.length, intervalMs]);

  if (!slides.length) return null;

  const scrollTo = (index: number) => {
    disableAutoplay();
    emblaApi?.scrollTo(index);
    thumbApi?.scrollTo(index);
    if (controlledIndex === undefined) setInternalIndex(index);
    const slide = slides[index];
    if (slide) onSelectedIndexChange?.(index, slide);
  };

  const handleNav = (direction: 'prev' | 'next') => {
    disableAutoplay();
    if (direction === 'prev') emblaApi?.scrollPrev();
    else emblaApi?.scrollNext();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className="relative group rounded-3xl overflow-hidden border border-primary-200/70 aspect-square w-full shadow-[0_24px_48px_-12px_rgba(195,109,128,0.35)] hover-3d"
        onPointerDown={disableAutoplay}
      >
        <div ref={emblaRef} className="overflow-hidden h-full">
          <div className="flex h-full touch-pan-y">
            {slides.map((slide, i) => (
              <div key={`${slide.src}-${slide.kind}-${slide.variantId ?? i}`} className="relative min-w-0 shrink-0 grow-0 basis-full h-full bg-gradient-hero">
                <img src={slide.src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
                {slide.kind === 'variant' ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent px-4 pb-4 pt-10">
                    <p className="text-[11px] uppercase tracking-wider text-primary-100/90 font-semibold">Ảnh biến thể</p>
                    <p className="text-sm font-semibold text-white mt-0.5">{slide.variantLabel ?? 'Phân loại'}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 ? (
          <>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              aria-label="Ảnh trước"
              onPress={() => handleNav('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1D1D1D] shadow-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <RiArrowLeftSLine size={20} />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              aria-label="Ảnh sau"
              onPress={() => handleNav('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 text-[#1D1D1D] shadow-md opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <RiArrowRightSLine size={20} />
            </Button>
          </>
        ) : null}

        {currentSlide?.kind === 'variant' ? (
          <div className="absolute top-3 left-3 z-20 rounded-full bg-primary-500/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#1D1D1D] shadow-md">
            Biến thể đang xem
          </div>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div ref={thumbRef} className="overflow-hidden w-full" onPointerDown={disableAutoplay}>
          <div className="flex gap-2.5 justify-center">
            {slides.map((slide, i) => (
              <button
                key={`thumb-${slide.src}-${slide.kind}-${slide.variantId ?? i}`}
                type="button"
                aria-label={`Xem ảnh ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={cn(
                  'relative shrink-0 w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-xl overflow-hidden border-2 transition-all duration-300',
                  selectedIndex === i
                    ? slide.kind === 'variant'
                      ? 'border-primary-600 ring-2 ring-primary-500/60 shadow-lg shadow-primary-300/60 scale-105'
                      : 'border-primary-500 ring-2 ring-primary-400/50 shadow-lg shadow-primary-200/60 scale-105'
                    : slide.kind === 'variant'
                      ? 'border-primary-400/80 opacity-85 hover:opacity-100 hover:scale-105'
                      : 'border-primary-200/70 opacity-75 hover:opacity-100 hover:scale-105',
                  firstVariantIndex === i && i > 0 && 'ml-2 before:absolute before:-left-2 before:top-1 before:bottom-1 before:w-px before:bg-primary-300/80',
                )}
              >
                <img src={slide.src} alt="" className="w-full h-full object-cover" />
                {slide.kind === 'variant' ? (
                  <span className="absolute bottom-0 inset-x-0 bg-primary-600/90 text-[8px] font-bold text-white text-center py-0.5">
                    BT
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
