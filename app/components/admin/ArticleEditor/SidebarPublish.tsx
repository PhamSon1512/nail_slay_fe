import { Button, Chip, Select, SelectItem } from '@heroui/react';
import { RiEyeLine } from 'react-icons/ri';
import { adminSelectClassNames } from '~/utils/adminForm';
import { formatPublishDateVi } from '~/utils/format';
import { cn } from '~/utils';
import { EditorMetabox } from './EditorMetabox';
import { SEO_PUBLISH_MIN_SCORE, canPublishBySeoScore } from './seoConstants';

type SidebarPublishProps = {
  status: 'draft' | 'published';
  visibility: 'public' | 'private';
  publishedAt?: string | null;
  seoScore: number;
  saving: boolean;
  isNew: boolean;
  onStatusChange: (s: 'draft' | 'published') => void;
  onVisibilityChange: (v: 'public' | 'private') => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
};

function scoreBarColor(score: number) {
  if (score >= SEO_PUBLISH_MIN_SCORE) return 'bg-green-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-red-500';
}

export function SidebarPublish({
  status,
  visibility,
  publishedAt,
  seoScore,
  saving,
  isNew,
  onStatusChange,
  onVisibilityChange,
  onPreview,
  onSaveDraft,
  onPublish,
}: SidebarPublishProps) {
  const canPublish = canPublishBySeoScore(seoScore);
  const publishLabel = publishedAt
    ? formatPublishDateVi(publishedAt)
    : status === 'published'
      ? 'Vừa xuất bản'
      : 'Chưa xuất bản';

  return (
    <EditorMetabox title="Xuất bản">
      <div className="space-y-3">
        <Button
          variant="bordered"
          size="sm"
          startContent={<RiEyeLine />}
          fullWidth
          className="border-[#c3c4c7]"
          onPress={onPreview}
        >
          Xem trước
        </Button>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#50575e]">Trạng thái:</span>
            <Chip size="sm" color={status === 'published' ? 'success' : 'default'} variant="flat">
              {status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </Chip>
          </div>
          <div className="space-y-1">
            <span className="text-[#50575e] text-xs">Xuất bản:</span>
            <p className="text-[#2c3338] text-xs leading-relaxed">{publishLabel}</p>
          </div>
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#50575e] font-medium">SEO</span>
              <span
                className={cn(
                  'font-semibold tabular-nums',
                  canPublish ? 'text-green-600' : 'text-[#2c3338]',
                )}
              >
                {seoScore}/100
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#dcdcde] overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all', scoreBarColor(seoScore))}
                style={{ width: `${seoScore}%` }}
              />
            </div>
            {!canPublish && (
              <p className="text-xs text-red-600 font-[Montserrat]">Cần đạt tối thiểu {SEO_PUBLISH_MIN_SCORE}/100 điểm SEO để xuất bản.</p>
            )}
          </div>
        </div>

        <Select
          label="Trạng thái"
          selectedKeys={[status]}
          onChange={(e) => {
            const next = e.target.value as 'draft' | 'published';
            if (next === 'published' && !canPublish) return;
            onStatusChange(next);
          }}
          classNames={adminSelectClassNames}
          size="sm"
        >
          <SelectItem key="draft">Bản nháp</SelectItem>
          <SelectItem key="published" isDisabled={!canPublish}>
            Xuất bản
          </SelectItem>
        </Select>

        <Select
          label="Hiển thị"
          selectedKeys={[visibility]}
          onChange={(e) => onVisibilityChange(e.target.value as 'public' | 'private')}
          classNames={adminSelectClassNames}
          size="sm"
        >
          <SelectItem key="public">Công khai</SelectItem>
          <SelectItem key="private">Một mình tôi</SelectItem>
        </Select>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#dcdcde]">
          <Button variant="light" size="sm" isLoading={saving} onPress={onSaveDraft} className="text-[#50575e]">
            Lưu nháp
          </Button>
          <Button
            color="primary"
            size="sm"
            isLoading={saving}
            isDisabled={!canPublish}
            onPress={onPublish}
            className="font-semibold text-[#1D1D1D]"
            title={
              canPublish
                ? undefined
                : `Cần đạt tối thiểu ${SEO_PUBLISH_MIN_SCORE}/100 điểm SEO để xuất bản`
            }
          >
            {isNew || status === 'draft' ? 'Xuất bản' : 'Cập nhật'}
          </Button>
        </div>
      </div>
    </EditorMetabox>
  );
}
