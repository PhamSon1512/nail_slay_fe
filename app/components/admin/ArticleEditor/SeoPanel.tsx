import { useState } from 'react';
import { Tab, Tabs } from '@heroui/react';
import type { SeoAnalysisResult } from './useSeoAnalysis';
import { SeoPreview } from './SeoPreview';
import { SnippetEditorModal } from './SnippetEditorModal';
import { SeoKeywordInput } from './SeoKeywordInput';
import { SeoChecklist } from './SeoChecklist';
import { SeoAdvanced } from './SeoAdvanced';
import { SeoSchema } from './SeoSchema';
import { SeoSocial } from './SeoSocial';

export type SeoPanelFormSlice = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  schemaType: string;
  noIndex: boolean;
  coverImageUrl: string | null;
  publishedAt?: string | null;
  ogImageUrl: string | null;
  ogImageFile: File | null;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  onFocusKeywordChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onCanonicalUrlChange: (v: string) => void;
  onSchemaTypeChange: (v: string) => void;
  onNoIndexChange: (v: boolean) => void;
  onOgImageFileChange: (f: File | null) => void;
  onRemoveOgImage: () => void;
  onExcerptChange: (v: string) => void;
};

type SeoPanelProps = {
  analysis: SeoAnalysisResult;
  form: SeoPanelFormSlice;
};

export function SeoPanel({ analysis, form }: SeoPanelProps) {
  const [snippetOpen, setSnippetOpen] = useState(false);

  return (
    <div className="border border-[#c3c4c7] bg-white shadow-sm">
      <div className="border-b border-[#c3c4c7] bg-[#f6f7f7] px-4 py-3">
        <h3 className="text-[15px] font-semibold text-[#1d2327]">Rank Math SEO</h3>
      </div>
      <div className="p-4">
        <Tabs aria-label="SEO tabs" color="primary" variant="underlined">
          <Tab key="general" title="Tổng quan">
            <div className="space-y-4 pt-2">
              <SeoPreview
                metaTitle={form.metaTitle}
                metaDescription={form.metaDescription}
                articleTitle={form.title}
                onEditSnippet={() => setSnippetOpen(true)}
              />
              <SeoKeywordInput
                value={form.focusKeyword}
                onChange={form.onFocusKeywordChange}
                score={analysis.score}
              />
              <SnippetEditorModal
                isOpen={snippetOpen}
                onClose={() => setSnippetOpen(false)}
                metaTitle={form.metaTitle}
                metaDescription={form.metaDescription}
                slug={form.slug}
                articleTitle={form.title}
                onMetaTitleChange={form.onMetaTitleChange}
                onMetaDescriptionChange={form.onMetaDescriptionChange}
                onSlugChange={form.onSlugChange}
              />
              <SeoChecklist
                basicChecks={analysis.basicChecks}
                additionalChecks={analysis.additionalChecks}
                titleReadability={analysis.titleReadability}
                contentReadability={analysis.contentReadability}
              />
            </div>
          </Tab>
          <Tab key="advanced" title="Nâng cao">
            <div className="pt-2">
              <SeoAdvanced
                metaTitle={form.metaTitle}
                metaDescription={form.metaDescription}
                canonicalUrl={form.canonicalUrl}
                noIndex={form.noIndex}
                onMetaTitleChange={form.onMetaTitleChange}
                onMetaDescriptionChange={form.onMetaDescriptionChange}
                onCanonicalUrlChange={form.onCanonicalUrlChange}
                onNoIndexChange={form.onNoIndexChange}
              />
            </div>
          </Tab>
          <Tab key="schema" title="Schema">
            <div className="pt-2">
              <SeoSchema
                schemaType={form.schemaType}
                title={form.metaTitle || form.title}
                metaDescription={form.metaDescription || form.excerpt}
                coverImageUrl={form.coverImageUrl}
                publishedAt={form.publishedAt}
                onSchemaTypeChange={form.onSchemaTypeChange}
              />
            </div>
          </Tab>
          <Tab key="social" title="Mạng xã hội">
            <div className="pt-2">
              <SeoSocial
                metaTitle={form.metaTitle || form.title}
                metaDescription={form.metaDescription || form.excerpt}
                ogImageUrl={form.ogImageUrl}
                ogImageFile={form.ogImageFile}
                onOgImageFileChange={form.onOgImageFileChange}
                onRemoveOgImage={form.onRemoveOgImage}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
