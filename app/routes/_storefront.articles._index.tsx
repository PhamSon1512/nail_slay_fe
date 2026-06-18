import type { Route } from './+types/_storefront.articles._index';
import { useEffect, useState } from 'react';
import { Input, Select, SelectItem } from '@heroui/react';
import { RiSearchLine } from 'react-icons/ri';
import { Link } from 'react-router';
import { SectionTitle } from '~/components';
import { fetchArticles, type ArticleListItem } from '~/utils/api/articles';
import { formatDate } from '~/utils/format';

export const handle = { pageTitle: 'Bài viết' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Bài viết - Nailslay' }];

type SortKey = 'title_asc' | 'title_desc' | 'newest' | 'oldest';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'title_asc', label: 'A → Z' },
  { key: 'title_desc', label: 'Z → A' },
  { key: 'newest', label: 'Mới nhất' },
  { key: 'oldest', label: 'Cũ nhất' },
];

export default function ArticlesListPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    fetchArticles({ q: debouncedSearch || undefined, sort, limit: 50 })
      .then((data) => setArticles(data.items))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [debouncedSearch, sort]);

  return (
    <div className="container py-10 space-y-6">
      <SectionTitle title="Bài viết" subtitle="Mẹo nail, xu hướng và câu chuyện từ NailSlay." />

      <div className="flex flex-col md:flex-row gap-3">
        <Input
          value={search}
          onValueChange={setSearch}
          placeholder="Tìm bài viết..."
          startContent={<RiSearchLine size={16} className="text-[#8E8A8A]" />}
          variant="bordered"
          className="md:max-w-sm"
          classNames={{ inputWrapper: 'border-primary-200 bg-white/80 dark:bg-[#2a2226]' }}
        />
        <Select
          aria-label="Sắp xếp bài viết"
          selectedKeys={new Set([sort])}
          onSelectionChange={(keys) => setSort(String(Array.from(keys)[0] ?? 'newest') as SortKey)}
          variant="bordered"
          className="md:max-w-xs"
          classNames={{ trigger: 'border-primary-200 bg-white/80 dark:bg-[#2a2226]' }}
        >
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>

      {loading ? (
        <p className="text-sm text-[#8E8A8A]">Đang tải bài viết...</p>
      ) : articles.length === 0 ? (
        <p className="text-sm text-[#8E8A8A]">Không tìm thấy bài viết phù hợp.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.slug}`}
              className="group rounded-2xl border border-primary-200/70 bg-white/95 dark:bg-[#2a2226] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gradient-hero overflow-hidden">
                {article.coverImageUrl ? (
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8E8A8A] text-sm">Không có ảnh bìa</div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1 text-xs text-[#8E8A8A]">
                  <p>{article.publishedAt ? formatDate(article.publishedAt) : ''}</p>
                  {article.author?.name ? (
                    <>
                      <span>•</span>
                      <p>👤 {article.author.name}</p>
                    </>
                  ) : null}
                </div>
                <h2 className="font-heading text-lg font-bold text-[#1D1D1D] dark:text-[#FFF3F5] line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {article.title}
                </h2>
                {article.excerpt ? (
                  <p className="text-sm text-[#8E8A8A] dark:text-[#FFDDE5] line-clamp-3">{article.excerpt}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
