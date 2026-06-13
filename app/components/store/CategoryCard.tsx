import { Link } from 'react-router';
import { Card, CardBody } from '@heroui/react';
import { RiArrowRightLine } from 'react-icons/ri';
import { formatTitleCase } from '~/utils/format';

type CategoryCardProps = {
  code: string;
  name: string;
  imageUrl?: string;
  href: string;
};

export function CategoryCard({ code, name, imageUrl, href }: CategoryCardProps) {
  const displayName = formatTitleCase(name);

  return (
    <Card
      as={Link}
      to={href}
      shadow="none"
      isPressable
      className="group border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] overflow-hidden hover:border-primary-400 hover:shadow-lg hover:shadow-primary-100/40 transition-all duration-300 hover-3d"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-hero">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayName}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">✨</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1D]/55 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-[11px] uppercase tracking-wider text-[#FFDDE5]/90">{code}</p>
          <h3 className="font-heading text-xl md:text-2xl font-bold leading-tight category-title">
            {displayName}
          </h3>
        </div>
      </div>
      <CardBody className="py-3 px-4">
        <span className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFDDE5] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Xem sản phẩm <RiArrowRightLine size={14} />
        </span>
      </CardBody>
    </Card>
  );
}
