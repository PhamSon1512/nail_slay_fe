import type { Route } from './+types/_storefront.products';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input, Select, SelectItem } from '@heroui/react';
import { RiSearchLine } from 'react-icons/ri';
import { ProductCard, SectionTitle } from '~/components';
import { CATEGORIES } from '~/data';
import { fetchStoreProducts, type StoreProduct } from '~/utils/api/catalog';
import { formatTitleCase } from '~/utils/format';

export const handle = { pageTitle: 'Sản phẩm' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Sản phẩm - Nailslay' }];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryOptions = CATEGORIES.filter((c) => c.level === 'child' || c.code === 'PK-02');
  const categorySlugMap = useMemo(
    () => new Map(categoryOptions.map((c) => [c.code, c.slug])),
    [categoryOptions],
  );

  useEffect(() => {
    setLoading(true);
    const slug = category ? categorySlugMap.get(category) : undefined;
    fetchStoreProducts({ limit: 100, q: search || undefined, category_slug: slug })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category, categorySlugMap]);

  return (
    <div className="container py-10 space-y-6">
      <SectionTitle
        title="Bộ sưu tập Sản phẩm"
        subtitle="Chọn style móng phù hợp với cá tính của bạn."
      />

      <div className="flex flex-col md:flex-row gap-3">
        <Input
          value={search}
          onValueChange={setSearch}
          placeholder="Tìm theo tên hoặc SKU..."
          startContent={<RiSearchLine size={16} className="text-[#8E8A8A]" />}
          variant="bordered"
          className="md:max-w-sm"
          classNames={{ inputWrapper: 'border-primary-200 bg-white/80 dark:bg-[#2a2226]' }}
        />
        <Select
          placeholder="Lọc danh mục"
          selectedKeys={category ? new Set([category]) : new Set()}
          onSelectionChange={(keys) => {
            const nextCategory = String(Array.from(keys)[0] ?? '');
            setCategory(nextCategory);
            const nextParams = new URLSearchParams(searchParams);
            if (nextCategory) {
              nextParams.set('category', nextCategory);
            } else {
              nextParams.delete('category');
            }
            setSearchParams(nextParams, { replace: true });
          }}
          variant="bordered"
          className="md:max-w-xs"
          classNames={{ trigger: 'border-primary-200 bg-white/80 dark:bg-[#2a2226]' }}
        >
          {categoryOptions.map((c) => (
            <SelectItem key={c.code}>{`${c.code} - ${formatTitleCase(c.name)}`}</SelectItem>
          ))}
        </Select>
      </div>

      {loading ? (
        <p className="text-sm text-[#8E8A8A]">Đang tải sản phẩm...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      )}
      {!loading && products.length === 0 ? (
        <p className="text-sm text-center text-[#8E8A8A] py-8">Không tìm thấy sản phẩm.</p>
      ) : null}
    </div>
  );
}
