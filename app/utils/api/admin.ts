import { http } from '../http';
import type { BannerItem, HomepageConfig, HomepageFeature } from '~/data/homepage';

export type AdminCategory = {
  id: string;
  code: string | null;
  name: string;
  slug: string;
  parentId: string | null;
  imageUrl: string | null;
};

export type AdminProductVariant = {
  id: string;
  productId: string;
  sku: string | null;
  name: string;
  color: string | null;
  size: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  sortOrder: number;
};

export type AdminProduct = {
  id: string;
  categoryId: string;
  sku: string | null;
  name: string;
  slug: string;
  description: string | null;
  status: 'active' | 'hidden' | 'draft';
  price: number;
  originalPrice: number | null;
  stock: number;
  imageUrls: string[];
  variants?: AdminProductVariant[];
};

export type Paginated<T> = {
  items: T[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
};

export async function fetchAdminStats() {
  const { data } = await http.get<Record<string, unknown>>('/admin/stats');
  return data;
}

export async function fetchAdminSettings() {
  const { data } = await http.get<{
    homepage: HomepageConfig;
    contact_info: Record<string, string> | null;
  }>('/admin/settings');
  return data;
}

export async function updateHomepageSettings(input: {
  features?: HomepageFeature[];
  featuredProductIds?: string[];
  contact_info?: Record<string, string>;
}) {
  const { data } = await http.put('/admin/settings/homepage', input);
  return data;
}

export async function fetchBanners() {
  const { data } = await http.get<{ banners: BannerItem[] }>('/admin/banners');
  return data.banners;
}

export async function createBanner(form: FormData) {
  const { data } = await http.post<BannerItem>('/admin/banners', form);
  return data;
}

export async function updateBanner(id: string, form: FormData) {
  const { data } = await http.put<BannerItem>(`/admin/banners/${id}`, form);
  return data;
}

export async function deleteBanner(id: string) {
  await http.delete(`/admin/banners/${id}`);
}

export async function fetchAdminCategories() {
  const { data } = await http.get<AdminCategory[]>('/admin/categories');
  return data;
}

export async function createCategory(form: FormData) {
  const { data } = await http.post<AdminCategory>('/admin/categories', form);
  return data;
}

export async function updateCategory(id: string, form: FormData) {
  const { data } = await http.put<AdminCategory>(`/admin/categories/${id}`, form);
  return data;
}

export async function deleteCategory(id: string) {
  await http.delete(`/admin/categories/${id}`);
}

export async function fetchAdminProducts(params?: { page?: number; limit?: number; search?: string }) {
  const { data } = await http.get<Paginated<AdminProduct>>('/admin/products', {
    params: {
      page: params?.page?.toString(),
      limit: params?.limit?.toString(),
      search: params?.search,
    },
  });
  return data;
}

export async function createProduct(form: FormData) {
  const { data } = await http.post<AdminProduct>('/admin/products', form);
  return data;
}

export async function updateProduct(id: string, form: FormData) {
  const { data } = await http.put<AdminProduct>(`/admin/products/${id}`, form);
  return data;
}

export async function deleteProduct(id: string) {
  await http.delete(`/admin/products/${id}`);
}

export async function fetchAdminOrders(params?: { page?: number; status?: string; search?: string; limit?: number }) {
  const { data } = await http.get<Paginated<Record<string, unknown>>>('/admin/orders', { params });
  return data;
}

export async function fetchAdminOrder(id: string) {
  const { data } = await http.get<Record<string, unknown>>(`/admin/orders/${id}`);
  return data;
}

export type BankInfo = {
  bank_name: string;
  account_number: string;
  account_name: string;
  transfer_content: string;
  qr_code_url: string;
};

export async function fetchBankSettings() {
  const { data } = await http.get<{ bank_info?: BankInfo | null }>('/admin/settings');
  return data.bank_info ?? null;
}

export async function updateBankSettings(form: FormData) {
  const { data } = await http.put<{ bank_info: BankInfo }>('/admin/settings/bank', form);
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data } = await http.patch(`/admin/orders/${id}/status`, { status });
  return data;
}

export async function fetchAdminUsers(params?: { page?: number; search?: string }) {
  const { data } = await http.get<Paginated<Record<string, unknown>>>('/admin/users', { params });
  return data;
}
