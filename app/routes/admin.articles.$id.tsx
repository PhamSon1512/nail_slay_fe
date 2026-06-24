import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Route } from './+types/admin.articles.$id';
import { Link, useNavigate, useParams } from 'react-router';
import { Button, Spinner } from '@heroui/react';
import toast from 'react-hot-toast';
import { RiArrowLeftLine, RiImageAddLine } from 'react-icons/ri';
import { ArticleEditorSidebar } from '~/components/admin/ArticleEditor/ArticleEditorSidebar';
import { ArticlePermalink } from '~/components/admin/ArticleEditor/ArticlePermalink';
import { ArticlePreviewModal } from '~/components/admin/ArticleEditor/ArticlePreviewModal';
import { ArticleRichTextEditor as _ArticleRichTextEditor, type ArticleRichTextEditorHandle } from '~/components/admin/ArticleEditor/ArticleRichTextEditor';
import { lazy, Suspense } from 'react';

const ArticleRichTextEditor = lazy(() => import('~/components/admin/ArticleEditor/ArticleRichTextEditor').then(m => ({ default: m.ArticleRichTextEditor })));
import { SeoPanel } from '~/components/admin/ArticleEditor/SeoPanel';
import { SEO_PUBLISH_MIN_SCORE, canPublishBySeoScore } from '~/components/admin/ArticleEditor/seoConstants';
import { useSeoAnalysis } from '~/components/admin/ArticleEditor/useSeoAnalysis';
import {
  checkFocusKeyword,
  createArticle,
  fetchArticleCategories,
  fetchAdminArticleById,
  fetchArticleTags,
  updateArticle,
  type ArticleCategory,
  type ArticleTag,
} from '~/utils/api/admin';
import { slugifyVi } from '~/utils/slugify';

export const handle = { pageTitle: 'Soạn bài viết' };
export const meta = (_: Route.MetaArgs) => [{ title: 'Soạn bài viết - Admin Nailslay' }];

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  visibility: 'public' | 'private';
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  schemaType: string;
  noIndex: boolean;
  coverFile: File | null;
  coverPreview: string | null;
  removeCover: boolean;
  ogImageFile: File | null;
  ogImageUrl: string | null;
  removeOgImage: boolean;
  categoryIds: string[];
  tagNames: string[];
  publishedAt?: string | null;
};

const emptyForm = (): FormState => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft',
  visibility: 'public',
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  canonicalUrl: '',
  schemaType: 'Article',
  noIndex: false,
  coverFile: null,
  coverPreview: null,
  removeCover: false,
  ogImageFile: null,
  ogImageUrl: null,
  removeOgImage: false,
  categoryIds: [],
  tagNames: [],
});

function buildFormData(data: FormState, seoScore: number): FormData {
  const fd = new FormData();
  fd.append('title', data.title.trim());
  fd.append('slug', data.slug.trim());
  fd.append('excerpt', data.excerpt.trim());
  fd.append('content', data.content);
  fd.append('status', data.status);
  fd.append('visibility', data.visibility);
  fd.append('meta_title', data.metaTitle.trim());
  fd.append('meta_description', data.metaDescription.trim());
  fd.append('focus_keyword', data.focusKeyword.trim());
  fd.append('canonical_url', data.canonicalUrl.trim());
  fd.append('schema_type', data.schemaType);
  fd.append('no_index', data.noIndex ? 'true' : 'false');
  fd.append('seo_score', String(seoScore));
  fd.append('category_ids', JSON.stringify(data.categoryIds));
  fd.append('tag_names', JSON.stringify(data.tagNames));
  if (data.coverFile) fd.append('cover', data.coverFile);
  if (data.removeCover) fd.append('remove_cover', 'true');
  if (data.ogImageFile) fd.append('og_image', data.ogImageFile);
  if (data.removeOgImage) fd.append('remove_og_image', 'true');
  if (data.ogImageUrl && !data.ogImageFile) fd.append('og_image_url', data.ogImageUrl);
  return fd;
}

export default function AdminArticleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const articleId = isNew ? null : id ?? null;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugManual, setSlugManual] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [tags, setTags] = useState<ArticleTag[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [focusKeywordUnique, setFocusKeywordUnique] = useState<boolean | null>(null);
  const metaTitleTouched = useRef(false);
  const metaDescTouched = useRef(false);
  const editorRef = useRef<ArticleRichTextEditorHandle>(null);

  const patch = useCallback((partial: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
    setDirty(true);
  }, []);

  useEffect(() => {
    void Promise.all([fetchArticleCategories(), fetchArticleTags()])
      .then(([cats, tgs]) => {
        setCategories(cats);
        setTags(tgs);
      })
      .catch(() => toast.error('Không tải được danh mục hoặc thẻ'));
  }, []);

  useEffect(() => {
    if (isNew || !articleId) return;
    setLoading(true);
    fetchAdminArticleById(articleId)
      .then((a) => {
        setForm({
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt ?? '',
          content: a.content,
          status: a.status,
          visibility: a.visibility ?? 'public',
          metaTitle: a.metaTitle ?? '',
          metaDescription: a.metaDescription ?? '',
          focusKeyword: a.focusKeyword ?? '',
          canonicalUrl: a.canonicalUrl ?? '',
          schemaType: a.schemaType ?? 'Article',
          noIndex: Boolean(a.noIndex),
          coverFile: null,
          coverPreview: a.coverImageUrl,
          removeCover: false,
          ogImageFile: null,
          ogImageUrl: a.ogImageUrl ?? null,
          removeOgImage: false,
          categoryIds: a.categoryIds ?? [],
          tagNames: (a.tags ?? []).map((t) => t.name),
          publishedAt: a.publishedAt,
        });
        setSlugManual(true);
        setDirty(false);
      })
      .catch(() => {
        toast.error('Không tải được bài viết');
        navigate('/admin/articles');
      })
      .finally(() => setLoading(false));
  }, [articleId, isNew, navigate]);

  useEffect(() => {
    const kw = form.focusKeyword.trim();
    if (!kw) {
      setFocusKeywordUnique(null);
      return;
    }
    const t = setTimeout(() => {
      void checkFocusKeyword(kw, articleId ?? undefined)
        .then((r) => setFocusKeywordUnique(r.isUnique))
        .catch(() => setFocusKeywordUnique(null));
    }, 400);
    return () => clearTimeout(t);
  }, [form.focusKeyword, articleId]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const analysis = useSeoAnalysis({
    title: form.title,
    slug: form.slug,
    metaTitle: form.metaTitle,
    metaDescription: form.metaDescription,
    focusKeyword: form.focusKeyword,
    contentHtml: form.content,
    excerpt: form.excerpt,
    focusKeywordUnique,
  });

  const handleTitleChange = useCallback(
    (title: string) => {
      const updates: Partial<FormState> = { title };
      if (!slugManual) updates.slug = slugifyVi(title);
      if (!metaTitleTouched.current) updates.metaTitle = title;
      patch(updates);
    },
    [patch, slugManual],
  );

  const handleExcerptChange = useCallback(
    (excerpt: string) => {
      const updates: Partial<FormState> = { excerpt };
      if (!metaDescTouched.current) updates.metaDescription = excerpt;
      patch(updates);
    },
    [patch],
  );

  const seoPanelForm = useMemo(
    () => ({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      focusKeyword: form.focusKeyword,
      canonicalUrl: form.canonicalUrl,
      schemaType: form.schemaType,
      noIndex: form.noIndex,
      coverImageUrl: form.coverPreview,
      publishedAt: form.publishedAt,
      ogImageUrl: form.ogImageUrl,
      ogImageFile: form.ogImageFile,
      onMetaTitleChange: (v: string) => {
        metaTitleTouched.current = true;
        patch({ metaTitle: v });
      },
      onMetaDescriptionChange: (v: string) => {
        metaDescTouched.current = true;
        patch({ metaDescription: v });
      },
      onFocusKeywordChange: (v: string) => patch({ focusKeyword: v }),
      onSlugChange: (v: string) => patch({ slug: v }),
      onCanonicalUrlChange: (v: string) => patch({ canonicalUrl: v }),
      onSchemaTypeChange: (v: string) => patch({ schemaType: v }),
      onNoIndexChange: (v: boolean) => patch({ noIndex: v }),
      onOgImageFileChange: (f: File | null) => patch({ ogImageFile: f, removeOgImage: false }),
      onRemoveOgImage: () => patch({ ogImageFile: null, ogImageUrl: null, removeOgImage: true }),
      onExcerptChange: handleExcerptChange,
    }),
    [form, patch, handleExcerptChange],
  );

  const save = async (status: 'draft' | 'published') => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error('Vui lòng nhập tiêu đề và slug');
      return;
    }
    if (status === 'published' && !canPublishBySeoScore(analysis.score)) {
      toast.error(`Điểm SEO phải đạt tối thiểu ${SEO_PUBLISH_MIN_SCORE}/100 để xuất bản bài viết.`);
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, status };
      const fd = buildFormData(payload, analysis.score);
      if (isNew) {
        const created = await createArticle(fd);
        toast.success('Đã tạo bài viết');
        setDirty(false);
        setForm((prev) => ({ ...prev, publishedAt: created.publishedAt ?? prev.publishedAt }));
        navigate(`/admin/articles/${created.id}`, { replace: true });
      } else if (articleId) {
        const updated = await updateArticle(articleId, fd);
        toast.success('Đã cập nhật bài viết');
        setDirty(false);
        setForm((prev) => ({ ...prev, publishedAt: updated.publishedAt ?? prev.publishedAt }));
      }
    } catch {
      toast.error('Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const coverPreviewUrl = form.coverFile ? URL.createObjectURL(form.coverFile) : form.coverPreview;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pb-12 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[color:var(--color-brand-muted)] mb-1 truncate">
            <Link to="/admin/articles" className="text-primary-600 hover:underline">
              Bài viết - SEO
            </Link>
            <span className="mx-1">›</span>
            <span>{isNew ? 'Thêm bài viết' : 'Sửa bài viết'}</span>
          </p>
          <h1 className="text-xl font-semibold text-[color:var(--color-brand-contrast)]">
            {isNew ? 'Thêm bài viết' : 'Sửa bài viết'}
          </h1>
        </div>
        <Button
          as={Link}
          to="/admin/articles"
          size="sm"
          variant="flat"
          startContent={<RiArrowLeftLine />}
          className="font-semibold text-[#1d1d1d]"
        >
          Quay lại danh sách
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
        <div className="space-y-4 min-w-0">
          <div className="border border-[#c3c4c7] bg-white shadow-sm">
            <input
              type="text"
              placeholder="Nhập tiêu đề bài viết"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full border-0 border-b border-[#c3c4c7] px-4 py-3 text-2xl font-normal text-[#1d2327] placeholder:text-[#a7aaad] focus:outline-none focus:ring-0"
            />
            <div className="px-4 py-2 border-b border-[#c3c4c7] bg-[#fafafa]">
              <ArticlePermalink
                slug={form.slug}
                onSlugChange={(slug) => patch({ slug })}
                onSlugManualChange={setSlugManual}
              />
            </div>
            <div className="px-3 py-2 border-b border-[#c3c4c7] bg-[#fafafa] flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="flat"
                color="primary"
                startContent={<RiImageAddLine />}
                className="font-semibold text-[#1d1d1d]"
                onPress={() => editorRef.current?.openMediaPicker()}
              >
                Thêm tệp
              </Button>
            </div>
          <Suspense fallback={<div className="h-[400px] flex items-center justify-center bg-white"><Spinner /></div>}>
            <ArticleRichTextEditor
              ref={editorRef}
              value={form.content}
              onChange={(content) => patch({ content })}
              className="border-0 shadow-none rounded-none"
            />
          </Suspense>
          </div>

          <SeoPanel analysis={analysis} form={seoPanelForm} />
        </div>

        <ArticleEditorSidebar
          status={form.status}
          visibility={form.visibility}
          publishedAt={form.publishedAt}
          seoScore={analysis.score}
          saving={saving}
          isNew={isNew}
          schemaType={form.schemaType}
          coverPreview={form.coverPreview}
          coverFile={form.coverFile}
          categories={categories}
          tags={tags}
          selectedCategoryIds={form.categoryIds}
          tagNames={form.tagNames}
          articleId={articleId ?? undefined}
          focusKeyword={form.focusKeyword}
          content={form.content}
          onStatusChange={(status) => patch({ status })}
          onVisibilityChange={(visibility) => patch({ visibility })}
          onPreview={() => setPreviewOpen(true)}
          onSaveDraft={() => void save('draft')}
          onPublish={() => void save('published')}
          onSchemaTypeChange={(schemaType) => patch({ schemaType })}
          onCoverChange={(f) => patch({ coverFile: f, removeCover: false })}
          onCoverClear={() => patch({ coverFile: null, coverPreview: null, removeCover: true })}
          onCategoryIdsChange={(categoryIds) => patch({ categoryIds })}
          onTagNamesChange={(tagNames) => patch({ tagNames })}
          onInsertLink={(url, title) => editorRef.current?.insertInternalLink(url, title)}
        />
      </div>

      <ArticlePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={{
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          coverPreview: coverPreviewUrl,
          tagNames: form.tagNames,
          publishedAt: form.publishedAt,
        }}
      />
    </div>
  );
}
