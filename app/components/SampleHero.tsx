import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { useEmbla } from '~/hooks';
import { cn } from '~/utils';
import { bigFadeUp } from '~/utils/animations';

export const SampleHero = () => {
  const { emblaRef, selectedIndex, scrollSnaps, onButtonClick } = useEmbla({ loop: true });

  return (
    <div>
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="child:flex-none child:basis-full child:relative flex">
          <div className="grid items-center gap-8 bg-gradient-to-b from-quy-500 to-quy-200 p-12 lg:grid-cols-[3fr_2fr] lg:bg-gradient-to-r">
            <motion.div {...bigFadeUp} className="max-lg:text-center text-white">
              <h2 className="mb-4 text-4xl font-black  lg:text-5xl xl:text-7xl">Nước hoa quả Once Farm</h2>
              <p className="my-4 text-xl">Tiết kiệm 30% cho đơn hàng dầu tiền</p>
              <Button size="lg" color="primary" className="bg-main rounded-full">
                Mua ngay
              </Button>
            </motion.div>
            <img src="/images/s1.png" alt="slide1" />
          </div>
          <div className="grid items-center gap-8 bg-gradient-to-b from-[#ffc692] to-[#ffeddf] p-12 lg:grid-cols-[3fr_2fr] lg:bg-gradient-to-r">
            <motion.div {...bigFadeUp} className="max-lg:text-center">
              <h2 className="mb-4 text-4xl font-black lg:text-5xl xl:text-7xl">Bánh quy hữu cơ Once Farm</h2>
              <p className="my-4 text-xl">Tiết kiệm 30% cho đơn hàng dầu tiền</p>
              <Button size="lg" color="primary" className="bg-main rounded-full">
                Mua ngay
              </Button>
            </motion.div>
            <img src="/images/s2.webp" alt="slide1" />
          </div>
          <div className="grid items-center gap-8 bg-gradient-to-b from-[#d8bbf0] to-[#f3ecfa] p-12 lg:grid-cols-[3fr_2fr] lg:bg-gradient-to-r">
            <motion.div {...bigFadeUp} className="max-lg:text-center">
              <h2 className="mb-4 text-4xl font-black lg:text-5xl xl:text-7xl">Bim bim hữu cơ Once Farm</h2>
              <p className="my-4 text-xl">Tiết kiệm 30% cho đơn hàng dầu tiền</p>
              <Button size="lg" color="primary" className="bg-main rounded-full">
                Mua ngay
              </Button>
            </motion.div>
            <img src="/images/s3.png" alt="slide1" />
          </div>
        </div>
      </div>
      <div className="relative z-10 inline-flex translate-x-32 -translate-y-11 space-x-4 lg:translate-x-16 lg:-translate-y-16">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => onButtonClick(index)}
            className={cn('cursor-pointer rounded-full p-2', index === selectedIndex && 'bg-gray-400/50')}
          >
            <div className="h-2 w-2 rounded-full bg-gray-600"></div>
          </button>
        ))}
      </div>
    </div>
  );
};
