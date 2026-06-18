import type { Route } from './+types/_storefront.articles.$slug';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { RiArrowLeftLine } from 'react-icons/ri';
import { RichContent } from '~/components/store/RichContent';
import { fetchArticleBySlug, type ArticleDetail, type ArticleListItem } from '~/utils/api/articles';
import { formatDate } from '~/utils/format';

export const handle = { pageTitle: 'Chi tiết bài viết' };
export const meta = ({ params }: Route.MetaArgs) => [{ title: `${params.slug ?? 'Bài viết'} - Nailslay` }];

export default function ArticleDetailPage() {
  const { slug: slugParam } = useParams();
  const slug = slugParam ?? '';
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [similar, setSimilar] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchArticleBySlug(slug)
      .then((data) => {
        setArticle(data.article);
        setSimilar(data.similar);
      })
      .catch(() => {
        setArticle(null);
        setSimilar([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="container py-20 text-center text-sm text-[#8E8A8A]">Đang tải...</div>;
  }

  if (!article) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="section-title">Không tìm thấy bài viết</h1>
        <Link to="/articles" className="text-sm text-primary-600 hover:underline">
          Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <Link
        to="/articles"
        className="inline-flex items-center gap-1.5 text-sm text-[#8E8A8A] hover:text-[#1D1D1D] dark:hover:text-[#FFF3F5] transition-colors"
      >
        <RiArrowLeftLine size={16} />
        Quay lại danh sách bài viết
      </Link>

      <article className="max-w-3xl mx-auto space-y-6">
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full rounded-2xl border border-primary-200/70 object-cover max-h-[420px]"
          />
        ) : null}

        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[#8E8A8A]">
            <p>{article.publishedAt ? formatDate(article.publishedAt) : ''}</p>
            {article.author?.name ? (
              <>
                <span>•</span>
                <p className="flex items-center gap-1 font-medium text-primary-600 dark:text-primary-400">
                  👤 Đăng bởi: {article.author.name}
                </p>
              </>
            ) : null}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5]">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="text-base text-[#8E8A8A] dark:text-[#FFDDE5]">{article.excerpt}</p>
          ) : null}
        </header>

        <RichContent html={article.content} />
      </article>

      {similar.length ? (
        <section className="space-y-4">
          <h2 className="section-title">Bài viết tương tự</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map((item) => (
              <Link
                key={item.id}
                to={`/articles/${item.slug}`}
                className="rounded-2xl border border-primary-200/70 bg-white/95 dark:bg-[#2a2226] overflow-hidden hover:shadow-md transition-shadow"
              >
                {item.coverImageUrl ? (
                  <img src={item.coverImageUrl} alt={item.title} className="w-full aspect-video object-cover" />
                ) : null}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-[#1D1D1D] dark:text-[#FFF3F5] line-clamp-2">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
