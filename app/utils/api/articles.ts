import { http } from '../http';

export type ArticleListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt?: string | null;
  createdAt?: string;
  author?: { id: string; name: string | null } | null;
};

export type ArticleDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
  author?: { id: string; name: string | null } | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  ogImageUrl?: string | null;
  canonicalUrl?: string | null;
  schemaType?: string | null;
  noIndex?: number | null;
  readingTime?: number | null;
  categories?: { id: string; name: string; slug: string }[];
  tags?: { id: string; name: string; slug: string }[];
};

export type ArticleListResponse = {
  items: ArticleListItem[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
};

export async function fetchArticles(params?: {
  page?: number;
  limit?: number;
  q?: string;
  sort?: 'title_asc' | 'title_desc' | 'newest' | 'oldest';
}) {
  const { data } = await http.get<ArticleListResponse>('/articles', {
    params: {
      page: params?.page?.toString(),
      limit: params?.limit?.toString(),
      q: params?.q,
      sort: params?.sort,
    },
  });
  return data;
}

export async function fetchArticleBySlug(slug: string) {
  const { data } = await http.get<{ article: ArticleDetail; similar: ArticleListItem[] }>(`/articles/${slug}`);
  return data;
}
