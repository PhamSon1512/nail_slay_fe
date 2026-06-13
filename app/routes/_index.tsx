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
  CategoryCard,
  Footer,
  HorizontalGallery,
  Navbar,
  ProductCard,
  SectionTitle,
} from '~/components';
import { BRAND, CATEGORIES } from '~/data';
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
                  className="block relative w-full aspect-[21/9] md:aspect-[21/7] overflow-hidden"
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title ?? BRAND.name}
                    className="w-full h-full object-cover"
                  />
                  {(banner.title || banner.subtitle) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1D1D1D]/50 via-transparent to-transparent flex items-center">
                      <div className="container py-8 space-y-2">
                        {banner.title ? (
                          <p className="brand-name text-3xl md:text-5xl text-white drop-shadow-lg">
                            {banner.title}
                          </p>
                        ) : null}
                        {banner.subtitle ? (
                          <p className="text-sm md:text-base text-[#FFDDE5] uppercase tracking-[0.2em]">
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

          <HorizontalGallery intervalMs={3000}>
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
            <HorizontalGallery intervalMs={3000}>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {homepage.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon] ?? RiShoppingBag3Line;
              return (
                <Card
                  key={feature.id}
                  shadow="none"
                  className="border border-primary-200/70 bg-white/80 dark:bg-[#2a2226]"
                >
                  <CardBody className="gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-[#1D1D1D]">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#8E8A8A] dark:text-[#FFDDE5]">{feature.description}</p>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
