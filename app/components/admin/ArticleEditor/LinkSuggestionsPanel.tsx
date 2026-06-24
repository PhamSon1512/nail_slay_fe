import { useCallback, useEffect, useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { fetchLinkSuggestions, type LinkSuggestionItem } from '~/utils/api/admin';
import { EditorMetabox } from './EditorMetabox';

type LinkSuggestionsPanelProps = {
  articleId?: string;
  focusKeyword: string;
  content: string;
  onInsertLink: (url: string, title: string) => void;
};

export function LinkSuggestionsPanel({ articleId, focusKeyword, content, onInsertLink }: LinkSuggestionsPanelProps) {
  const [items, setItems] = useState<LinkSuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);

  const query = focusKeyword.trim() || content.replace(/<[^>]+>/g, ' ').trim().slice(0, 80);

  const load = useCallback(async () => {
    if (!query || query.length < 2) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchLinkSuggestions({ articleId, q: query });
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [articleId, query]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 400);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <EditorMetabox title="Đề xuất liên kết" defaultOpen={items.length > 0}>
      <p className="text-xs text-[#50575e] mb-3 leading-relaxed">
        Hệ thống gợi ý liên kết nội bộ dựa trên từ khóa và nội dung bài viết hiện tại, giúp tăng liên kết chéo giữa các
        bài.
      </p>
      {loading ? (
        <Spinner size="sm" />
      ) : !query || query.length < 2 ? (
        <p className="text-xs text-[#8E8A8A]">Nhập từ khóa SEO hoặc nội dung để nhận gợi ý.</p>
      ) : items.length === 0 ? (
        <p className="text-xs text-[#8E8A8A]">Chưa có bài phù hợp.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-2 border-b border-[#f0f0f1] pb-2 last:border-0">
              <div className="min-w-0">
                <p className="font-medium text-sm text-[#2c3338] truncate">{item.title}</p>
                <p className="text-xs text-[#50575e] truncate">{item.url}</p>
              </div>
              <Button size="sm" variant="flat" color="primary" onPress={() => onInsertLink(item.absoluteUrl ?? item.url, item.title)}>
                Chèn
              </Button>
            </li>
          ))}
        </ul>
      )}
    </EditorMetabox>
  );
}
