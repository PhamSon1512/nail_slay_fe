import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '~/utils';

type DisplayMode = 'contain-blur' | 'contain' | 'cover';

type BannerSlideImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function BannerSlideImage({ src, alt, className }: BannerSlideImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<DisplayMode>('contain-blur');

  const evaluate = useCallback((img: HTMLImageElement) => {
    const box = containerRef.current;
    if (!box) return;

    const cw = box.clientWidth;
    const ch = box.clientHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    if (!cw || !ch || !iw || !ih) return;

    if (iw < cw && ih < ch) {
      setMode('contain-blur');
      return;
    }

    if (iw > cw || ih > ch) {
      setMode('cover');
      return;
    }

    setMode('contain');
  }, []);

  useEffect(() => {
    const box = containerRef.current;
    if (!box) return;

    const observer = new ResizeObserver(() => {
      const img = box.querySelector<HTMLImageElement>('img[data-banner-foreground]');
      if (img?.complete && img.naturalWidth > 0) {
        evaluate(img);
      }
    });

    observer.observe(box);
    return () => observer.disconnect();
  }, [evaluate, src]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden min-h-[180px] md:min-h-[240px]',
        mode === 'cover' ? 'h-[min(70vh,560px)]' : 'max-h-[min(70vh,560px)]',
        className,
      )}
    >
      {mode === 'contain-blur' ? (
        <img
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50 pointer-events-none select-none"
        />
      ) : null}

      <img
        key={src}
        src={src}
        alt={alt}
        data-banner-foreground
        onLoad={(e) => evaluate(e.currentTarget)}
        className={cn(
          'relative z-10 mx-auto block w-full',
          mode === 'cover'
            ? 'h-full object-cover object-center'
            : 'h-auto max-h-[min(70vh,560px)] object-contain',
        )}
      />
    </div>
  );
}
