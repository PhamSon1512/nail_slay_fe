import { Button } from '@heroui/react';

const SITE_NAME = 'NailSlay';

type SeoPreviewProps = {
  metaTitle: string;
  metaDescription: string;
  articleTitle: string;
  onEditSnippet?: () => void;
};

export function SeoPreview({ metaTitle, metaDescription, articleTitle, onEditSnippet }: SeoPreviewProps) {
  const displayTitle = metaTitle.trim() || articleTitle.trim();
  const previewLine = displayTitle ? `${displayTitle} — ${SITE_NAME}` : `— ${SITE_NAME}`;

  return (
    <div className="space-y-3 border-b border-[#dcdcde] pb-4">
      <h4 className="text-sm font-semibold text-[#1d2327]">Xem trước</h4>
      <p className="text-sm text-[#1a0dab] leading-snug">{previewLine}</p>
      {onEditSnippet && (
        <Button
          size="sm"
          color="primary"
          className="font-medium"
          onPress={onEditSnippet}
        >
          Chỉnh sửa đoạn trích
        </Button>
      )}
    </div>
  );
}
