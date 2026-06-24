import type { Route } from './+types/_storefront.articles.$slug';
import { Link, useLoaderData } from 'react-router';
import { RiArrowLeftLine, RiLink } from 'react-icons/ri';
import { RichContent } from '~/components/store/RichContent';
import { fetchArticleBySlugServer } from '~/utils/.server/articles';
import type { ArticleDetail } from '~/utils/api/articles';
import { formatDate } from '~/utils/format';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';

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
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity1 = useTransform(scrollY, [0, 600], [1, 0.2]);

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép liên kết bài viết!');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#141012] overflow-hidden pb-20">
      <ArticleJsonLd article={article} />

      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#ff93bf] to-[#ff6ea8] z-50 origin-left drop-shadow-md"
        style={{ scaleX }}
      />

      {/* Background Decorative Light Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#ffd6e6] dark:bg-[#b42362]/10 blur-[100px] opacity-70" />
        <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#f2a7b7]/30 dark:bg-[#6b153a]/20 blur-[120px] opacity-60" />
      </div>

      {/* Hero Parallax Section */}
      <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden flex flex-col justify-end pb-12 md:pb-20 z-10">
        {article.coverImageUrl ? (
          <motion.div 
            className="absolute inset-0 w-full h-[120%]"
            style={{ y: y1, opacity: opacity1 }}
          >
             <img src={article.coverImageUrl} className="w-full h-full object-cover object-center" alt={article.title} />
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          </motion.div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#ffb6c1] to-[#ff6ea8] dark:from-[#4a1c2d] dark:to-[#2a111a]" />
        )}

        <div className="container relative z-20">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors mb-6 backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full w-fit"
          >
            <RiArrowLeftLine size={16} />
            Danh sách bài viết
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl backdrop-blur-xl bg-white/10 dark:bg-black/30 border border-white/20 p-6 md:p-10 rounded-[2rem] shadow-2xl"
          >
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90 mb-5">
               {article.tags && article.tags.length > 0 ? (
                 <div className="flex flex-wrap gap-2 mr-2">
                   {article.tags.map((t) => (
                     <span key={t.id} className="text-xs rounded-full bg-[#ff6ea8]/80 text-white px-3 py-1 font-semibold backdrop-blur-md shadow-sm">
                       {t.name}
                     </span>
                   ))}
                 </div>
               ) : null}
              <p className="font-medium text-white/80">{article.publishedAt ? formatDate(article.publishedAt) : ''}</p>
              {article.readingTime ? (
                <>
                  <span className="text-white/50">•</span>
                  <p className="font-medium text-[#ffd6e6]">{article.readingTime} phút đọc</p>
                </>
              ) : null}
            </div>

            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 drop-shadow-lg tracking-tight">
              {article.title}
            </h1>

            {article.excerpt ? (
              <p className="text-base md:text-xl text-white/90 line-clamp-3 md:line-clamp-none max-w-3xl font-light leading-relaxed">
                {article.excerpt}
              </p>
            ) : null}
            
            {article.author?.name ? (
              <div className="mt-8 flex items-center gap-4 border-t border-white/20 pt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffb6c1] to-[#ff6ea8] flex items-center justify-center text-white text-lg font-bold shadow-lg border-2 border-white/50">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-0.5 uppercase tracking-wider font-semibold">Tác giả</p>
                  <p className="font-bold text-white text-base">
                    {article.author.name}
                  </p>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container relative z-20 -mt-10 md:-mt-16">
        <motion.article 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto bg-white/95 dark:bg-[#1a1518]/95 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-14 shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-white dark:border-[#2a2226]"
        >
          <RichContent html={article.content} className="prose-lg md:prose-xl prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#ff6ea8]" />

          {/* Social Share / Author Block */}
          <div className="mt-20 pt-10 border-t border-primary-100 dark:border-[#2a2226] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-[#1D1D1D] dark:text-[#FFF3F5] uppercase tracking-wider">Chia sẻ:</span>
              <button 
                onClick={copyLink}
                className="w-11 h-11 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center hover:bg-[#ff6ea8] hover:text-white hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-sm"
                title="Sao chép liên kết"
              >
                <RiLink size={20} />
              </button>
            </div>
            {article.tags && article.tags.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {article.tags.map((t) => (
                   <span key={t.id} className="text-xs rounded-full border border-[#ffb6c1] bg-[#fff5f7] dark:bg-[#2a111a] text-[#b42362] dark:text-[#ffb6c1] px-4 py-1.5 font-medium transition-colors hover:bg-[#ffb6c1] hover:text-white">
                     #{t.name}
                   </span>
                 ))}
               </div>
            ) : null}
          </div>
        </motion.article>
      </div>

      {/* Similar Articles */}
      {similar.length ? (
        <div className="container relative z-20 mt-24">
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-heading font-extrabold text-[#1D1D1D] dark:text-[#FFF3F5] mb-8 text-center"
            >
              Cùng Chủ Đề <span className="text-[#ff6ea8]">NailSlay</span>
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {similar.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={`/articles/${item.slug}`}
                    className="group block rounded-[2rem] border border-primary-100 dark:border-[#2a2226] bg-white/80 dark:bg-[#1a1518]/80 backdrop-blur-md overflow-hidden hover:shadow-[0_20px_40px_rgb(255,110,168,0.15)] transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {item.coverImageUrl ? (
                        <img 
                          src={item.coverImageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-[#2a2226] dark:to-[#1a1518]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-bold text-[#1D1D1D] dark:text-[#FFF3F5] line-clamp-3 group-hover:text-[#ff6ea8] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-[#8E8A8A] font-medium">
                        <span>{item.publishedAt ? formatDate(item.publishedAt) : ''}</span>
                        <span className="text-[#ff6ea8] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Đọc tiếp →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
