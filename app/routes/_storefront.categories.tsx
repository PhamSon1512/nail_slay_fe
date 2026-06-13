import type { Route } from './+types/_storefront.categories';
import { CategoryCard, SectionTitle } from '~/components';
import { CATEGORIES } from '~/data';

export const handle = { pageTitle: 'Danh mục' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Danh mục - Nailslay' }];

export default function CategoriesPage() {
  const groups = CATEGORIES.filter((c) => c.level === 'child' || c.code === 'PK-02');

  return (
    <div className="container py-10 space-y-6">
      <SectionTitle
        title="Danh mục sản phẩm"
        subtitle="Khám phá các phong cách nail box được thiết kế riêng cho bạn."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <CategoryCard
            key={group.code}
            code={group.code}
            name={group.name}
            imageUrl={group.imageUrl}
            href={`/products?category=${group.code}`}
          />
        ))}
      </div>
    </div>
  );
}
