import { http } from '../http';

export type StoreProduct = {
  id: string;
  categoryId: string;
  sku?: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  stock: number;
  imageUrls: string[];
  sizeOptions?: string[];
  formOptions?: string[];
  createdAt?: string;
};

export async function fetchStoreProducts(params?: { limit?: number; q?: string; category_slug?: string }) {
  const { data } = await http.get<{ items: StoreProduct[] }>('/products', {
    params: {
      limit: params?.limit?.toString() ?? '100',
      q: params?.q,
      category_slug: params?.category_slug,
    },
  });
  return data.items;
}

export async function fetchStoreProduct(slug: string) {
  const { data } = await http.get<StoreProduct & { variants?: Array<Record<string, unknown>> }>(`/products/${slug}`);
  return data;
}
