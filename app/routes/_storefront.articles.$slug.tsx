import type { Route } from './+types/_storefront.articles.$slug';
import { Link, useLoaderData } from 'react-router';
import { RiArrowLeftLine } from 'react-icons/ri';
import { RichContent } from '~/components/store/RichContent';
import { fetchArticleBySlugServer } from '~/utils/.server/articles';
import type { ArticleDetail } from '~/utils/api/articles';
import { formatDate } from '~/utils/format';

export const handle = { pageTitle: 'Chi tiết bài viết' };

const SITE_ORIGIN = 'https://nailslaystudio.com';

export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug ?? '';
  if (!slug) throw new Response('Not Found', { status: 404 });

  try {
    const data = await fetchArticleBySlugServer(slug);
    return data;
  } catch {
    throw new Response('Not Found', { status: 404 });
  }
}

export function meta({ data, params }: Route.MetaArgs) {
  const slug = params.slug ?? '';
  if (!data?.article) {
    return [{ title: `${slug} - Nailslay` }];
  }

  const article = data.article;
  const title = article.metaTitle || article.title;
  const description = article.metaDescription || article.excerpt || '';
  const image = article.ogImageUrl || article.coverImageUrl || '';
  const canonical = article.canonicalUrl || `${SITE_ORIGIN}/articles/${article.slug}`;
  const robots = article.noIndex ? 'noindex, nofollow' : 'index, follow';

  const tags: ({ title?: string } | { name: string; content: string } | { tagName: string; content: string } | { property: string; content: string } | { rel: string; href: string })[] = [
    { title },
    { name: 'description', content: description },
    { name: 'robots', content: robots },
    { rel: 'canonical', href: canonical },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: canonical },
  ];

  if (image) {
    tags.push({ property: 'og:image', content: image });
    tags.push({ name: 'twitter:card', content: 'summary_large_image' });
    tags.push({ name: 'twitter:image', content: image });
  }

  tags.push({ name: 'twitter:title', content: title });
  tags.push({ name: 'twitter:description', content: description });

  return tags;
}

function ArticleJsonLd({ article }: { article: ArticleDetail }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': article.schemaType || 'Article',
    headline: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    image: article.ogImageUrl || article.coverImageUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: article.author?.name
      ? { '@type': 'Person', name: article.author.name }
      : { '@type': 'Organization', name: 'Nailslay' },
    publisher: { '@type': 'Organization', name: 'Nailslay' },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ArticleDetailPage() {
  const { article, similar } = useLoaderData<typeof loader>();

  return (
    <div className="container py-8 space-y-8">
      <ArticleJsonLd article={article} />

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
            {article.readingTime ? (
              <>
                <span>•</span>
                <p>{article.readingTime} phút đọc</p>
              </>
            ) : null}
            {article.author?.name ? (
              <>
                <span>•</span>
                <p className="flex items-center gap-1 font-medium text-primary-600 dark:text-primary-400">
                  Đăng bởi: {article.author.name}
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
          {article.tags && article.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {article.tags.map((t) => (
                <span key={t.id} className="text-xs rounded-full bg-primary-50 px-2 py-0.5 text-primary-700">
                  {t.name}
                </span>
              ))}
            </div>
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
