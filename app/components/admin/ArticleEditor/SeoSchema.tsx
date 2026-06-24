import { Select, SelectItem } from '@heroui/react';
import { adminSelectClassNames } from '~/utils/adminForm';

const SCHEMA_TYPES = [
  { key: 'Article', label: 'Article' },
  { key: 'BlogPosting', label: 'Blog Posting' },
  { key: 'NewsArticle', label: 'News Article' },
  { key: 'HowTo', label: 'HowTo' },
  { key: 'FAQPage', label: 'FAQ' },
];

type SeoSchemaProps = {
  schemaType: string;
  title: string;
  metaDescription: string;
  coverImageUrl: string | null;
  publishedAt?: string | null;
  onSchemaTypeChange: (v: string) => void;
};

export function SeoSchema({
  schemaType,
  title,
  metaDescription,
  coverImageUrl,
  publishedAt,
  onSchemaTypeChange,
}: SeoSchemaProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType || 'Article',
    headline: title,
    description: metaDescription,
    image: coverImageUrl ? [coverImageUrl] : undefined,
    datePublished: publishedAt ?? undefined,
  };

  return (
    <div className="space-y-4">
      <Select
        label="Loại Schema"
        selectedKeys={[schemaType || 'Article']}
        onChange={(e) => onSchemaTypeChange(e.target.value)}
        classNames={adminSelectClassNames}
      >
        {SCHEMA_TYPES.map((s) => (
          <SelectItem key={s.key}>{s.label}</SelectItem>
        ))}
      </Select>
      <div>
        <p className="text-sm font-medium text-[#2D2A2A] mb-2">JSON-LD Preview</p>
        <pre className="overflow-auto rounded-lg border border-[#E8E4E4] bg-[#FAFAFA] p-3 text-xs text-[#5C5858] max-h-48">
          {JSON.stringify(jsonLd, null, 2)}
        </pre>
      </div>
    </div>
  );
}
