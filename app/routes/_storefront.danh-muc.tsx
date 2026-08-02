import type { Route } from './+types/_storefront.danh-muc';
import { useEffect, useState } from 'react';
import { CategoryCard, SectionTitle } from '~/components';
import { fetchStoreCategories, type StoreCategory } from '~/utils/api/catalog';

export const handle = { pageTitle: 'Danh mục' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Danh mục - Nailslay' }];

export default function CategoriesPage() {
  const [storeCategories, setStoreCategories] = useState<StoreCategory[]>([]);

  useEffect(() => {
    fetchStoreCategories()
      .then(setStoreCategories)
      .catch(() => setStoreCategories([]));
  }, []);

  const groups = storeCategories.filter((c) => c.parentId || (!c.parentId && c.code === 'PK-02'));

  return (
    <div className="container py-10 space-y-6">
      <SectionTitle
        title="Danh mục Sản phẩm"
        subtitle="Khám phá các phong cách nail box được thiết kế riêng cho bạn."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <CategoryCard
            key={group.id}
            code={group.code ?? group.slug}
            name={group.name}
            imageUrl={group.imageUrl ?? undefined}
            href={`/san-pham?category=${group.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
