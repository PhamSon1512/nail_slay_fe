import { LinkSuggestionsPanel } from './LinkSuggestionsPanel';
import { SidebarFormat } from './SidebarFormat';
import { SidebarMeta } from './SidebarMeta';
import { SidebarPublish } from './SidebarPublish';

type ArticleEditorSidebarProps = {
  status: 'draft' | 'published';
  visibility: 'public' | 'private';
  publishedAt?: string | null;
  seoScore: number;
  saving: boolean;
  isNew: boolean;
  schemaType: string;
  coverPreview: string | null;
  coverFile: File | null;
  categories: Parameters<typeof SidebarMeta>[0]['categories'];
  tags: Parameters<typeof SidebarMeta>[0]['tags'];
  selectedCategoryIds: string[];
  tagNames: string[];
  articleId?: string;
  focusKeyword: string;
  content: string;
  onStatusChange: (s: 'draft' | 'published') => void;
  onVisibilityChange: (v: 'public' | 'private') => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  onSchemaTypeChange: (v: string) => void;
  onCoverChange: (f: File | null) => void;
  onCoverClear: () => void;
  onCategoryIdsChange: (ids: string[]) => void;
  onTagNamesChange: (names: string[]) => void;
  onInsertLink: (url: string, title: string) => void;
};

export function ArticleEditorSidebar(props: ArticleEditorSidebarProps) {
  return (
    <div className="space-y-3 lg:sticky lg:top-4">
      <SidebarPublish
        status={props.status}
        visibility={props.visibility}
        publishedAt={props.publishedAt}
        seoScore={props.seoScore}
        saving={props.saving}
        isNew={props.isNew}
        onStatusChange={props.onStatusChange}
        onVisibilityChange={props.onVisibilityChange}
        onPreview={props.onPreview}
        onSaveDraft={props.onSaveDraft}
        onPublish={props.onPublish}
      />
      <SidebarFormat schemaType={props.schemaType} onSchemaTypeChange={props.onSchemaTypeChange} />
      <SidebarMeta
        coverPreview={props.coverPreview}
        coverFile={props.coverFile}
        categories={props.categories}
        tags={props.tags}
        selectedCategoryIds={props.selectedCategoryIds}
        tagNames={props.tagNames}
        onCoverChange={props.onCoverChange}
        onCoverClear={props.onCoverClear}
        onCategoryIdsChange={props.onCategoryIdsChange}
        onTagNamesChange={props.onTagNamesChange}
      />
      <LinkSuggestionsPanel
        articleId={props.articleId}
        focusKeyword={props.focusKeyword}
        content={props.content}
        onInsertLink={props.onInsertLink}
      />
    </div>
  );
}
