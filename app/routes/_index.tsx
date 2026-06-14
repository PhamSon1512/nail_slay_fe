import type { Route } from './+types/_index';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Button, Card, CardBody } from '@heroui/react';
import {
  RiArrowRightLine,
  RiShieldCheckLine,
  RiShoppingBag3Line,
  RiTruckLine,
} from 'react-icons/ri';
import {
  AutoSlideGallery,
  BannerSlideImage,
  CategoryCard,
  Footer,
  HorizontalGallery,
  Navbar,
  ProductCard,
  SectionTitle,
} from '~/components';
import { BRAND, CATEGORIES, DEFAULT_HOMEPAGE_THANK_YOU } from '~/data';
import { useHomepage } from '~/hooks';
import { fetchStoreProducts, type StoreProduct } from '~/utils/api/catalog';

export const meta = (_: Route.MetaArgs) => [
  { title: `${BRAND.name} - Nail Box Premium` },
  {
    name: 'description',
    content: `${BRAND.slogan}. Bộ sưu tập nail box và phụ kiện móng chất lượng cao.`,
  },
];

const FEATURE_ICONS = {
  truck: RiTruckLine,
  shield: RiShieldCheckLine,
  bag: RiShoppingBag3Line,
} as const;

export default function HomePage() {
  const { homepage } = useHomepage();
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    fetchStoreProducts({ limit: 100 })
      .then(setStoreProducts)
      .catch(() => setStoreProducts([]));
  }, []);

  const activeBanners = useMemo(
    () =>
      [...homepage.banners]
        .filter((b) => b.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .slice(0, 6),
    [homepage.banners],
  );

  const childCategories = useMemo(
    () =>
      CATEGORIES.filter((c) => c.level === 'child' || c.code === 'PK-02')
        .slice(0, 6),
    [],
  );

  const featuredProducts = useMemo(() => {
    if (!homepage.featuredProductIds.length || !storeProducts.length) return [];

    const byId = new Map(
      storeProducts.map((p) => [
        p.id,
        {
          id: p.id,
          sku: p.sku ?? '',
          name: p.name,
          slug: p.slug,
          salePrice: p.price,
          originalPrice: p.originalPrice ?? p.price,
          imageUrls: p.imageUrls ?? [],
          categoryCode: '',
          stock: p.stock,
          isFeatured: true,
        },
      ]),
    );

    return homepage.featuredProductIds
      .map((id) => byId.get(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .slice(0, 6);
  }, [homepage.featuredProductIds, storeProducts]);

  const mapProduct = (p: (typeof featuredProducts)[number]) => ({
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    price: p.salePrice,
    originalPrice: p.originalPrice,
    imageUrls: p.imageUrls,
    categoryName: p.categoryCode,
    stock: p.stock,
    isNew: ('isNew' in p ? (p as any).isNew : false) as boolean,
    isBestSeller: p.isFeatured,
  });

  const thankYou = homepage.thankYou ?? DEFAULT_HOMEPAGE_THANK_YOU;

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--color-brand-bg)] dark:bg-[#1d1d1d]">
      <Navbar />

      <main className="flex-1">
        {activeBanners.length > 0 ? (
          <section className="w-full">
            <AutoSlideGallery intervalMs={3000} showArrows showDots className="w-full">
              {activeBanners.map((banner) => (
                <Link
                  key={banner.id}
                  to={banner.link ?? '/products'}
                  className="block relative w-full bg-[#1d1d1d]/5 dark:bg-black/30"
                >
                  <BannerSlideImage
                    src={banner.imageUrl}
                    alt={banner.title ?? BRAND.name}
                  />
                  {(banner.title || banner.subtitle) && (
                    <div className="absolute inset-0 z-20 flex items-end bg-gradient-to-t from-[#1D1D1D]/75 via-[#1D1D1D]/25 to-transparent md:items-center md:bg-gradient-to-r md:from-[#1D1D1D]/50 md:via-transparent md:to-transparent pointer-events-none">
                      <div className="container w-full px-4 pb-5 pt-10 sm:px-6 sm:pb-6 md:py-8 space-y-1 sm:space-y-2">
                        {banner.title ? (
                          <p className="brand-name text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white drop-shadow-lg line-clamp-2 md:line-clamp-none leading-tight">
                            {banner.title}
                          </p>
                        ) : null}
                        {banner.subtitle ? (
                          <p className="text-[10px] sm:text-xs md:text-base text-[#FFDDE5] uppercase tracking-[0.14em] sm:tracking-[0.2em] line-clamp-2 md:line-clamp-none">
                            {banner.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </AutoSlideGallery>
          </section>
        ) : null}

        <section className="container py-12 md:py-14">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[#8E8A8A]">{BRAND.slogan}</p>
            <h1 className="hero-tagline text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl mx-auto">
              Nail đẹp mỗi ngày,
              <br />
              <span className="whitespace-nowrap">tự tin tỏa sáng</span>
            </h1>
            <p className="text-sm md:text-base text-[#8E8A8A] dark:text-[#FFDDE5] leading-relaxed">
              Chuyên nail box thiết kế theo xu hướng. Mix sắc hồng nude tinh tế, phù hợp đi làm,
              đi chơi và sự kiện đặc biệt.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button as={Link} to="/products" color="primary" className="font-semibold text-[#1D1D1D]">
                Mua sắm ngay
              </Button>
              <Button as={Link} to="/categories" variant="flat" className="font-medium text-[#1D1D1D]">
                Xem danh mục
              </Button>
            </div>
          </div>
        </section>

        <section className="container pb-14">
          <div className="flex items-end justify-between mb-6 gap-4">
            <SectionTitle title="Danh mục Nailbox" />
            <Link
              to="/categories"
              className="text-sm text-[#1D1D1D] dark:text-[#FFDDE5] hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
            >
              Xem tất cả <RiArrowRightLine size={14} />
            </Link>
          </div>

          <HorizontalGallery intervalMs={3000} pauseOnHover>
            {childCategories.map((category) => (
              <CategoryCard
                key={category.code}
                code={category.code}
                name={category.name}
                imageUrl={category.imageUrl}
                href={`/products?category=${category.code}`}
              />
            ))}
          </HorizontalGallery>
        </section>

        <section className="container pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homepage.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon] ?? RiShoppingBag3Line;
              return (
                <Card
                  key={feature.id}
                  shadow="none"
                  className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226] flex flex-col hover-3d transition-all duration-300 hover:border-primary-300 group py-6 px-6"
                >
                  <CardBody className="gap-4 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-[#1D1D1D] mb-1 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={24} />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#8E8A8A] dark:text-[#FFDDE5] leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container pb-16">
          <div className="flex items-end justify-between mb-6 gap-4">
            <SectionTitle title="Sản phẩm nổi bật" />
            <Link
              to="/products"
              className="text-sm text-[#1D1D1D] dark:text-[#FFDDE5] hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
            >
              Xem tất cả <RiArrowRightLine size={14} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <HorizontalGallery intervalMs={3000} pauseOnHover>
              {featuredProducts.map((product) => (
                <ProductCard key={product!.id} product={mapProduct(product!)} />
              ))}
            </HorizontalGallery>
          ) : (
            <p className="text-sm text-[#8E8A8A] text-center py-8">
              Chưa có sản phẩm nổi bật. Admin cấu hình tại Cài đặt trang chủ.
            </p>
          )}
        </section>

        <section className="container pb-16">
          <div className="bg-white dark:bg-[#201a1d] rounded-3xl p-8 md:p-12 text-center border-2 border-primary-200 dark:border-primary-800 shadow-[8px_8px_0px_0px_#ffdde5] dark:shadow-[8px_8px_0px_0px_rgba(242,167,183,0.15)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#ffdde5] dark:hover:shadow-[4px_4px_0px_0px_rgba(242,167,183,0.15)] transition-all duration-300">
            <div className="w-16 h-16 bg-primary-50 dark:bg-[#1d1d1d] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-100 dark:border-primary-800">
              <RiShieldCheckLine size={32} className="text-primary-500" />
            </div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5] mb-4">
              {thankYou.title}
            </h2>
            <p className="text-[#8E8A8A] dark:text-[#FFDDE5] max-w-2xl mx-auto leading-relaxed mb-10 text-sm md:text-base">
              {thankYou.content}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {thankYou.stats.map((stat) => (
                <div key={stat.id} className="flex flex-col items-center group">
                  <p className="text-3xl md:text-4xl font-heading font-bold text-primary-500 group-hover:scale-110 transition-transform">
                    {stat.value}
                  </p>
                  <p className="text-[11px] md:text-xs uppercase tracking-wider text-[#8E8A8A] mt-2 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
