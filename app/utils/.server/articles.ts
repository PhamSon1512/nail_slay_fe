import type { ArticleDetail, ArticleListItem } from '~/utils/api/articles';

const API_BASE = import.meta.env.VITE_HOST;

export async function fetchArticleBySlugServer(slug: string): Promise<{
  article: ArticleDetail;
  similar: ArticleListItem[];
}> {
  const res = await fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Response('Not Found', { status: res.status });
  }
  return res.json();
}
