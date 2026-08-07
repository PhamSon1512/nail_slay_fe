import { useEffect, useMemo, useState } from 'react';
import { Chip, Input, Spinner } from '@heroui/react';
import { Link } from 'react-router';
import { CategoryTreeCheckboxes } from './CategoryTreeCheckboxes';
import type { ArticleCategory, ArticleTag } from '~/utils/api/admin';
import { fetchPopularArticleCategories, fetchPopularArticleTags } from '~/utils/api/admin';
import { adminInputClassNames } from '~/utils/adminForm';
import { EditorMetabox } from './EditorMetabox';
import { FeaturedImageBox } from './FeaturedImageBox';

type SidebarMetaProps = {
  coverPreview: string | null;
  coverFile: File | null;
  categories: ArticleCategory[];
  tags: ArticleTag[];
  selectedCategoryIds: string[];
  tagNames: string[];
  onCoverChange: (f: File | null) => void;
  onCoverClear: () => void;
  onCategoryIdsChange: (ids: string[]) => void;
  onTagNamesChange: (names: string[]) => void;
};

export function SidebarMeta({
  coverPreview,
  coverFile,
  categories,
  tags,
  selectedCategoryIds,
  tagNames,
  onCoverChange,
  onCoverClear,
  onCategoryIdsChange,
  onTagNamesChange,
}: SidebarMetaProps) {
  const [tagInput, setTagInput] = useState('');
  const [categoryTab, setCategoryTab] = useState<'all' | 'popular'>('all');
  const [popularCategories, setPopularCategories] = useState<ArticleCategory[]>([]);
  const [popularTags, setPopularTags] = useState<ArticleTag[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [showPopularTags, setShowPopularTags] = useState(false);

  const coverUrl = coverFile ? URL.createObjectURL(coverFile) : coverPreview ?? undefined;

  useEffect(() => {
    if (categoryTab !== 'popular') return;
    setLoadingPopular(true);
    void fetchPopularArticleCategories()
      .then(setPopularCategories)
      .catch(() => setPopularCategories([]))
      .finally(() => setLoadingPopular(false));
  }, [categoryTab]);

  useEffect(() => {
    void fetchPopularArticleTags()
      .then(setPopularTags)
      .catch(() => setPopularTags([]));
  }, []);

  const displayCategories = useMemo(() => {
    if (categoryTab === 'all') return categories;
    const ids = new Set(popularCategories.map((c) => c.id));
    const withAncestors = new Map<string, ArticleCategory>();
    for (const c of popularCategories) {
      withAncestors.set(c.id, c);
      let parentId = c.parentId ?? null;
      while (parentId) {
        const parent = categories.find((x) => x.id === parentId);
        if (!parent || withAncestors.has(parent.id)) break;
        withAncestors.set(parent.id, parent);
        parentId = parent.parentId ?? null;
      }
    }
    return categories
      .filter((c) => ids.has(c.id) || withAncestors.has(c.id))
      .map((c) => {
        const pop = popularCategories.find((p) => p.id === c.id) as
          | (ArticleCategory & { articleCount?: number })
          | undefined;
        return pop?.articleCount != null ? { ...c, articleCount: pop.articleCount } : c;
      });
  }, [categoryTab, categories, popularCategories]);

  const suggestedTags = useMemo(
    () => (showPopularTags ? popularTags : tags).map((t) => t.name).filter((n) => !tagNames.includes(n)).slice(0, 12),
    [tags, popularTags, tagNames, showPopularTags],
  );

  const addTag = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || tagNames.includes(trimmed)) return;
    onTagNamesChange([...tagNames, trimmed]);
    setTagInput('');
  };

  const addTagsFromInput = () => {
    tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .forEach(addTag);
  };

  return (
    <>
      <EditorMetabox title="Danh mục">
        <div className="space-y-3">
          <div className="flex gap-4 border-b border-[#dcdcde] pb-2 text-xs">
            <button
              type="button"
              className={categoryTab === 'all' ? 'font-semibold text-primary-600' : 'text-[#50575e] hover:text-[#2c3338]'}
              onClick={() => setCategoryTab('all')}
            >
              Tất cả danh mục
            </button>
            <button
              type="button"
              className={
                categoryTab === 'popular' ? 'font-semibold text-primary-600' : 'text-[#50575e] hover:text-[#2c3338]'
              }
              onClick={() => setCategoryTab('popular')}
            >
              Dùng nhiều nhất
            </button>
          </div>
          {loadingPopular ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : displayCategories.length === 0 ? (
            <p className="text-xs text-[#50575e]">
              Chưa có danh mục.{' '}
              <Link to="/admin/articles/categories" className="text-primary-600 hover:underline">
                Quản lý danh mục
              </Link>{' '}
              từ sidebar.
            </p>
          ) : (
            <CategoryTreeCheckboxes
              categories={displayCategories}
              selectedIds={selectedCategoryIds}
              onChange={onCategoryIdsChange}
              showCounts={categoryTab === 'popular'}
            />
          )}
        </div>
      </EditorMetabox>

      <EditorMetabox title="Ảnh đại diện">
        <FeaturedImageBox previewUrl={coverUrl} onChange={onCoverChange} onClear={onCoverClear} />
      </EditorMetabox>

      <EditorMetabox title="Thẻ">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1 min-h-[24px]">
            {tagNames.map((t) => (
              <Chip
                key={t}
                size="sm"
                onClose={() => onTagNamesChange(tagNames.filter((x) => x !== t))}
                variant="flat"
                classNames={{ base: 'bg-primary-100' }}
              >
                {t}
              </Chip>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              size="sm"
              placeholder="Thêm thẻ..."
              value={tagInput}
              onValueChange={setTagInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTagsFromInput();
                }
              }}
              classNames={adminInputClassNames}
            />
            <button
              type="button"
              className="text-xs text-primary-600 hover:underline shrink-0 px-1"
              onClick={addTagsFromInput}
            >
              Thêm
            </button>
          </div>
          <p className="text-xs text-[#50575e]">Thẻ được lưu khi bạn xuất bản / cập nhật bài viết.</p>
          {suggestedTags.length > 0 && (
            <button
              type="button"
              className="text-xs text-primary-600 hover:underline"
              onClick={() => setShowPopularTags((v) => !v)}
            >
              {showPopularTags ? 'Ẩn gợi ý' : 'Chọn từ những thẻ được dùng nhiều nhất'}
            </button>
          )}
          {suggestedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {suggestedTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="text-xs text-primary-600 hover:underline"
                  onClick={() => addTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </EditorMetabox>
    </>
  );
}
