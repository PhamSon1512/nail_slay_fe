import type { Route } from './+types/_storefront.products';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Input, Select, SelectItem } from '@heroui/react';
import { RiSearchLine } from 'react-icons/ri';
import { ProductCard, SectionTitle } from '~/components';
import { CATEGORIES, PRODUCTS } from '~/data';
import { formatTitleCase } from '~/utils/format';

export const handle = { pageTitle: 'Sản phẩm' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Sản phẩm - Nailslay' }];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') ?? '');

  const categoryOptions = CATEGORIES.filter((c) => c.level === 'child' || c.code === 'PK-02');

  const products = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const okCategory = !category || product.categoryCode === category;
      const okSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      return okCategory && okSearch;
    });
  }, [category, search]);

  return (
    <div className="container py-10 space-y-6">
      <SectionTitle
        title="Bộ sưu tập sản phẩm"
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              sku: product.sku,
              name: product.name,
              slug: product.slug,
              price: product.salePrice,
              originalPrice: product.originalPrice,
              imageUrls: product.imageUrls,
              categoryName: product.categoryCode,
              stock: product.stock,
              isNew: product.isNew,
              isBestSeller: product.isFeatured,
            }}
          />
        ))}
      </div>
    </div>
  );
}
