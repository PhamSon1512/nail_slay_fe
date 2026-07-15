import { http } from '../http';
import type { BannerItem, HomepageConfig, HomepageFeature, HomepageThankYou } from '~/data/homepage';

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
    tracking_codes?: { id: string; name: string; code: string; enabled: boolean }[];
  }>('/admin/settings');
  return data;
}

export async function updateHomepageSettings(input: {
  features?: HomepageFeature[];
  featuredProductIds?: string[];
  thankYou?: HomepageThankYou;
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

export async function fetchAdminProduct(id: string) {
  const { data } = await http.get<AdminProduct>(`/admin/products/${id}`);
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
  const { data } = await http.get<Record<string, unknown>>('/admin/settings');
  const bank = data.bank_info as BankInfo | null | undefined;
  if (bank?.qr_code_url) return bank;
  const qrUrl = typeof data.qr_code_url === 'string' ? data.qr_code_url : '';
  if (bank) return { ...bank, qr_code_url: bank.qr_code_url || qrUrl };
  return qrUrl
    ? ({
        bank_name: '',
        account_number: '',
        account_name: '',
        transfer_content: '',
        qr_code_url: qrUrl,
      } satisfies BankInfo)
    : null;
}

export async function updateBankSettings(form: FormData) {
  const { data } = await http.put<{ bank_info: BankInfo }>('/admin/settings/bank', form);
  return data;
}



export async function updateAdminSettings(payload: Record<string, unknown>) {
  const { data } = await http.put<Record<string, unknown>>('/admin/settings', payload);
  return data;
}

export async function fetchAdminUsers(params?: { page?: number; search?: string }) {
  const { data } = await http.get<Paginated<Record<string, unknown>>>('/admin/users', { params });
  return data;
}

export async function updateAdminUser(
  id: string,
  input: {
    accountStatus?: 'active' | 'blocked';
    blockReason?: string;
    role?: string;
    fullName?: string;
    phone?: string;
  },
) {
  const { data } = await http.patch(`/admin/users/${id}`, input);
  return data;
}

export async function fetchAdminComplaints() {
  const { data } = await http.get<Record<string, unknown>[]>('/admin/complaints');
  return data;
}

export async function resolveAdminComplaint(id: string, adminResponse: string) {
  const { data } = await http.patch(`/admin/complaints/${id}`, {
    admin_response: adminResponse,
    status: 'RESOLVED',
  });
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data } = await http.patch(`/admin/orders/${id}/status`, { status });
  return data;
}

export type AdminArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  status: 'draft' | 'published';
  visibility?: 'public' | 'private';
  publishedAt?: string | null;
  createdAt?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  schemaType?: string | null;
  noIndex?: number | null;
  readingTime?: number | null;
  seoScore?: number | null;
  categoryIds?: string[];
  tagIds?: string[];
  tags?: { id: string; name: string; slug: string }[];
};

export type ArticleCategory = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

export type ArticleTag = {
  id: string;
  name: string;
  slug: string;
};

export type SeoAiSuggestResult = {
  focusKeywords: string[];
  metaTitle: string;
  metaDescription: string;
  relatedQuestions: string[];
};

export async function fetchAdminArticles(params?: { page?: number; limit?: number; search?: string }) {
  const { data } = await http.get<Paginated<AdminArticle>>('/admin/articles', {
    params: {
      page: params?.page?.toString(),
      limit: params?.limit?.toString(),
      search: params?.search,
    },
  });
  return data;
}

export async function fetchAdminArticleById(id: string) {
  const { data } = await http.get<AdminArticle>(`/admin/articles/${id}`);
  return data;
}

export async function checkFocusKeyword(keyword: string, excludeId?: string) {
  const { data } = await http.get<{ isUnique: boolean; usedBy: string | null }>('/admin/articles/check-focus-keyword', {
    params: { keyword, excludeId },
  });
  return data;
}

export async function fetchArticleCategories() {
  const { data } = await http.get<ArticleCategory[]>('/admin/article-categories');
  return data;
}

export async function fetchPopularArticleCategories(limit = 20) {
  const { data } = await http.get<(ArticleCategory & { articleCount?: number })[]>('/admin/article-categories/popular', {
    params: { limit: String(limit) },
  });
  return data;
}

export async function createArticleCategory(payload: { name: string; slug?: string; parent_id?: string }) {
  const { data } = await http.post<ArticleCategory>('/admin/article-categories', payload);
  return data;
}

export async function updateArticleCategory(id: string, payload: { name?: string; slug?: string; parent_id?: string }) {
  const { data } = await http.patch<ArticleCategory>(`/admin/article-categories/${id}`, payload);
  return data;
}

export async function deleteArticleCategory(id: string) {
  const { data } = await http.delete<{ success: boolean }>(`/admin/article-categories/${id}`);
  return data;
}

export async function fetchArticleTags() {
  const { data } = await http.get<ArticleTag[]>('/admin/article-tags');
  return data;
}

export async function fetchPopularArticleTags(limit = 20) {
  const { data } = await http.get<(ArticleTag & { articleCount?: number })[]>('/admin/article-tags/popular', {
    params: { limit: String(limit) },
  });
  return data;
}

export async function createArticleTag(payload: { name: string; slug?: string }) {
  const { data } = await http.post<ArticleTag>('/admin/article-tags', payload);
  return data;
}

export async function suggestSeoAi(payload: { title: string; content?: string; excerpt?: string }) {
  const { data } = await http.post<SeoAiSuggestResult>('/admin/articles/seo-ai-suggest', payload);
  return data;
}

export async function createArticle(form: FormData) {
  const { data } = await http.post<AdminArticle>('/admin/articles', form);
  return data;
}

export async function updateArticle(id: string, form: FormData) {
  const { data } = await http.put<AdminArticle>(`/admin/articles/${id}`, form);
  return data;
}

export async function deleteArticle(id: string) {
  await http.delete(`/admin/articles/${id}`);
}

export async function uploadContentImage(file: File) {
  const form = new FormData();
  form.append('image', file);
  const { data } = await http.post<{ url: string }>('/admin/upload/content-image', form);
  return data;
}

export async function uploadContentAsset(file: File) {
  const form = new FormData();
  form.append('file', file);
  const { data } = await http.post<{ url: string; mimeType: string; fileName: string }>(
    '/admin/upload/content-asset',
    form,
  );
  return data;
}

export type NotFoundLog = {
  id: string;
  path: string;
  referrer: string | null;
  userAgent: string | null;
  hitCount: number;
  firstSeen: string;
  lastSeen: string;
};

export type UrlRedirect = {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: 301 | 302;
  enabled: boolean;
  createdAt: string;
};

export type LinkSuggestionItem = {
  id: string;
  title: string;
  slug: string;
  url: string;
  absoluteUrl?: string;
  score: number;
};

export async function fetchNotFoundLogs() {
  const { data } = await http.get<NotFoundLog[]>('/admin/seo/404-logs');
  return data;
}

export async function deleteNotFoundLog(id: string) {
  await http.delete(`/admin/seo/404-logs/${id}`);
}

export async function fetchRedirects() {
  const { data } = await http.get<UrlRedirect[]>('/admin/seo/redirects');
  return data;
}

export async function createRedirect(payload: {
  fromPath: string;
  toPath: string;
  statusCode?: number;
  enabled?: boolean;
}) {
  const { data } = await http.post<UrlRedirect>('/admin/seo/redirects', payload);
  return data;
}

export async function updateRedirect(
  id: string,
  payload: { fromPath?: string; toPath?: string; statusCode?: number; enabled?: boolean },
) {
  const { data } = await http.put<UrlRedirect>(`/admin/seo/redirects/${id}`, payload);
  return data;
}

export async function deleteRedirect(id: string) {
  await http.delete(`/admin/seo/redirects/${id}`);
}

export async function fetchLinkSuggestions(params: { articleId?: string; q?: string }) {
  const { data } = await http.get<{ items: LinkSuggestionItem[] }>('/admin/articles/link-suggestions', {
    params: { articleId: params.articleId, q: params.q },
  });
  return data;
}
