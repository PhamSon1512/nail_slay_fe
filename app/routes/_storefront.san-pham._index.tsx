import type { Route } from './+types/_storefront.san-pham._index';
import { useEffect, useMemo, useState, useRef } from 'react';

const formatK = (price: number) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toLocaleString('vi-VN')}M`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toLocaleString('vi-VN')}k`;
  }
  return `${price}đ`;
};
import { useSearchParams } from 'react-router';
import { Button, Input, Slider } from '@heroui/react';
import { RiFilterOffLine, RiSearchLine } from 'react-icons/ri';
import { ProductCard, SectionTitle } from '~/components';
import { CATEGORIES } from '~/data';
import { fetchStoreProducts, type StoreProduct } from '~/utils/api/catalog';
import { formatVND, formatTitleCase } from '~/utils/format';

export const handle = { pageTitle: 'Sản phẩm' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Sản phẩm - Nailslay' }];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [maxPriceLimit, setMaxPriceLimit] = useState(1000000);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [debouncedPrice, setDebouncedPrice] = useState<[number, number]>([0, 1000000]);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const lastParamsRef = useRef('');

  const categoryOptions = CATEGORIES.filter((c) => c.level === 'child' || c.code === 'PK-02');
  const categorySlugMap = useMemo(
    () => new Map(categoryOptions.map((c) => [c.code, c.slug])),
    [categoryOptions],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedPrice(priceRange);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [priceRange]);

  useEffect(() => {
    const slug = category ? categorySlugMap.get(category) : undefined;
    const min_price = debouncedPrice[0] > 0 ? debouncedPrice[0] : undefined;
    const max_price = debouncedPrice[1] < maxPriceLimit ? debouncedPrice[1] : undefined;
    
    const paramsKey = JSON.stringify({ search, category, slug, min_price, max_price });
    if (paramsKey === lastParamsRef.current) {
      return;
    }
    lastParamsRef.current = paramsKey;

    setLoading(true);
    fetchStoreProducts({
      limit: 100,
      q: search || undefined,
      category_slug: slug,
      min_price,
      max_price,
    })
      .then((items) => {
        setProducts(items);
        if (maxPriceLimit === 1000000 && !search && !category && debouncedPrice[0] === 0 && debouncedPrice[1] === 1000000) {
          const highest = items.reduce((max, p) => (p.price > max ? p.price : max), 0) || 1000000;
          setMaxPriceLimit(highest);
          setPriceRange([0, highest]);
          setDebouncedPrice([0, highest]);
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category, categorySlugMap, debouncedPrice, maxPriceLimit]);

  const handleCategorySelect = (code: string) => {
    const nextCategory = category === code ? '' : code;
    setCategory(nextCategory);
    const nextParams = new URLSearchParams(searchParams);
    if (nextCategory) {
      nextParams.set('category', nextCategory);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setPriceRange([0, maxPriceLimit]);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="container py-10 space-y-8">
      <SectionTitle
        title="Bộ sưu tập Sản phẩm"
        subtitle="Chọn style móng phù hợp với cá tính của bạn."
      />

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar Filter Column */}
        <div className="w-full md:w-72 shrink-0 space-y-6 rounded-2xl border border-primary-200/60 bg-white/90 p-6 shadow-sm dark:bg-[#2a2226]">
          <div className="flex items-center justify-between border-b border-primary-100 pb-3 dark:border-primary-900">
            <h3 className="font-semibold text-lg text-primary-900 dark:text-primary-100">
              Bộ lọc sản phẩm
            </h3>
            {(search || category || priceRange[0] > 0 || priceRange[1] < maxPriceLimit) && (
              <Button
                size="sm"
                variant="light"
                color="danger"
                startContent={<RiFilterOffLine />}
                onClick={handleResetFilters}
                className="text-xs px-2"
              >
                Xóa lọc
              </Button>
            )}
          </div>

          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-800 dark:text-primary-200">
              Tìm kiếm
            </label>
            <Input
              value={search}
              onValueChange={setSearch}
              placeholder="Tên sản phẩm, SKU..."
              startContent={<RiSearchLine size={16} className="text-[#8E8A8A]" />}
              variant="bordered"
              size="sm"
              classNames={{ inputWrapper: 'border-primary-200 bg-white dark:bg-[#1a1518]' }}
            />
          </div>

          {/* Price Range Slider Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-primary-800 dark:text-primary-200">
                Khoảng giá
              </label>
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                {formatVND(priceRange[0])} - {formatVND(priceRange[1])}
              </span>
            </div>
            <Slider
              step={10000}
              minValue={0}
              maxValue={maxPriceLimit}
              value={priceRange}
              onChange={(val) => {
                if (Array.isArray(val)) setPriceRange(val as [number, number]);
              }}
              aria-label="Khoảng giá sản phẩm"
              size="sm"
              color="primary"
              classNames={{
                track: 'bg-primary-100 dark:bg-primary-900/40',
                filler: 'bg-primary-500',
                thumb: 'w-4 h-4 bg-white border-2 border-primary-600 shadow',
              }}
            />
            <div className="flex justify-between text-[11px] text-[#8E8A8A]">
              <span>0đ</span>
              <span>{formatK(maxPriceLimit / 2)}</span>
              <span>{formatK(maxPriceLimit)}</span>
            </div>
          </div>

          {/* Category List Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-primary-800 dark:text-primary-200">
              Danh mục
            </label>
            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => handleCategorySelect('')}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  !category
                    ? 'bg-primary-500 font-semibold text-white shadow-sm'
                    : 'text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30'
                }`}
              >
                <span>Tất cả sản phẩm</span>
              </button>
              {categoryOptions.map((c) => {
                const isActive = category === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCategorySelect(c.code)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-primary-500 font-semibold text-white shadow-sm'
                        : 'text-primary-700 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/30'
                    }`}
                  >
                    <span className="truncate">{formatTitleCase(c.name)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Product Grid Area */}
        <div className="flex-1 w-full min-w-0">
          {loading ? (
            <div className="py-20 text-center">
              <p className="text-sm text-[#8E8A8A]">Đang tải sản phẩm...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => {
                  const isNew = product.createdAt
                    ? Date.now() - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
                    : false;
                  return (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        sku: product.sku ?? '',
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        originalPrice: product.originalPrice ?? product.price,
                        imageUrls: product.imageUrls ?? [],
                        categoryName: '',
                        stock: product.stock,
                        isNew,
                      }}
                    />
                  );
                })}
              </div>
              {products.length === 0 && (
                <div className="rounded-2xl border border-dashed border-primary-200 p-12 text-center">
                  <p className="text-base font-medium text-primary-800 dark:text-primary-200">
                    Không tìm thấy sản phẩm nào
                  </p>
                  <p className="mt-1 text-sm text-[#8E8A8A]">
                    Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
                  </p>
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    onClick={handleResetFilters}
                    className="mt-4"
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

