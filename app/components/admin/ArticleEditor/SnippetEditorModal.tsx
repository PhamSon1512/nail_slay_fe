import { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
  Textarea,
} from '@heroui/react';
import { RiComputerLine, RiSmartphoneLine } from 'react-icons/ri';
import { cn } from '~/utils';
import { adminInputClassNames } from '~/utils/adminForm';
import { countSeoCharacters } from './seoTextLength';

const SITE_NAME = 'NailSlay';
const TITLE_CHAR_MAX = 60;
const TITLE_PX_MAX = 580;
const DESC_CHAR_MAX = 160;
const DESC_PX_MAX = 920;
const SLUG_CHAR_MAX = 75;

function estimateTitlePx(len: number): number {
  return Math.min(TITLE_PX_MAX, Math.round((len / TITLE_CHAR_MAX) * TITLE_PX_MAX));
}

function estimateDescPx(len: number): number {
  return Math.min(DESC_PX_MAX, Math.round((len / DESC_CHAR_MAX) * DESC_PX_MAX));
}

function barColor(len: number, min: number, max: number): string {
  if (len === 0 || len < min) return 'bg-red-500';
  if (len > max) return 'bg-orange-500';
  return 'bg-green-500';
}

function LengthBar({ len, min, max, px, pxMax }: { len: number; min: number; max: number; px: number; pxMax: number }) {
  const pct = Math.min(100, (len / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-end text-xs text-[#50575e]">
        {len} / {max} ({px}px / {pxMax}px)
      </div>
      <div className="h-1 w-full rounded-full bg-[#e8e8e8] overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', barColor(len, min, max))} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

type SnippetEditorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  articleTitle: string;
  siteUrl?: string;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  onSlugChange: (v: string) => void;
};

export function SnippetEditorModal({
  isOpen,
  onClose,
  metaTitle,
  metaDescription,
  slug,
  articleTitle,
  siteUrl = 'nailslaystudio.com',
  onMetaTitleChange,
  onMetaDescriptionChange,
  onSlugChange,
}: SnippetEditorModalProps) {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const displayTitle = metaTitle.trim() || articleTitle.trim() || `— ${SITE_NAME}`;
  const displayDesc = metaDescription.trim() || 'Mô tả meta sẽ hiển thị trong kết quả tìm kiếm.';
  const permalink = `${siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}/articles/${slug || 'slug-bai-viet'}/`;

  const titleLen = countSeoCharacters(metaTitle);
  const descLen = countSeoCharacters(metaDescription);
  const slugLen = countSeoCharacters(slug);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-[#dcdcde] pb-3">
          <span className="text-base font-semibold text-[#1d2327]">Xem trước trình chỉnh sửa đoạn trích</span>
        </ModalHeader>
        <ModalBody className="py-4">
          <Tabs aria-label="Snippet editor tabs" color="primary" variant="underlined" size="sm">
            <Tab key="overview" title="Tổng quan">
              <div className="space-y-5 pt-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[#1d2327]">Xem trước</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label="Desktop"
                        className={cn(
                          'p-1.5 rounded',
                          previewDevice === 'desktop' ? 'bg-primary-100 text-primary-600' : 'text-[#50575e] hover:bg-[#f0f0f1]',
                        )}
                        onClick={() => setPreviewDevice('desktop')}
                      >
                        <RiComputerLine size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label="Mobile"
                        className={cn(
                          'p-1.5 rounded',
                          previewDevice === 'mobile' ? 'bg-primary-100 text-primary-600' : 'text-[#50575e] hover:bg-[#f0f0f1]',
                        )}
                        onClick={() => setPreviewDevice('mobile')}
                      >
                        <RiSmartphoneLine size={18} />
                      </button>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'rounded border border-[#dcdcde] bg-white p-4',
                      previewDevice === 'mobile' ? 'max-w-[360px]' : 'w-full',
                    )}
                  >
                    <p className="text-xs text-[#006621] truncate mb-0.5">{permalink}</p>
                    <p className="text-lg text-[#1a0dab] leading-snug line-clamp-2">{displayTitle}</p>
                    <p className="text-sm text-[#4d5156] line-clamp-2 mt-1">{displayDesc}</p>
                  </div>
                </div>

                <div className="rounded bg-[#f6f7f7] border border-[#dcdcde] p-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-[#1d2327]">Tiêu đề SEO</label>
                    </div>
                    <LengthBar
                      len={titleLen}
                      min={10}
                      max={TITLE_CHAR_MAX}
                      px={estimateTitlePx(titleLen)}
                      pxMax={TITLE_PX_MAX}
                    />
                    <input
                      className="mt-2 w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-sm text-[#2c3338] focus:border-primary-500 focus:outline-none"
                      value={metaTitle}
                      onChange={(e) => onMetaTitleChange(e.target.value)}
                      placeholder="%title% %sep% %sitename%"
                    />
                    <p className="mt-1.5 text-xs text-[#50575e]">
                      Đây là nội dung sẽ xuất hiện ở dòng đầu tiên khi bài viết này hiển thị trong kết quả tìm kiếm.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-[#1d2327]">Liên kết cố định</label>
                    </div>
                    <LengthBar len={slugLen} min={1} max={SLUG_CHAR_MAX} px={slugLen * 8} pxMax={SLUG_CHAR_MAX * 8} />
                    <input
                      className="mt-2 w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-sm text-[#2c3338] focus:border-primary-500 focus:outline-none"
                      value={slug}
                      onChange={(e) => onSlugChange(e.target.value)}
                      placeholder="slug-bai-viet"
                    />
                    <p className="mt-1.5 text-xs text-[#50575e]">
                      Đây là URL duy nhất của trang này, được hiển thị bên dưới tiêu đề bài viết trong kết quả tìm kiếm.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-[#1d2327]">Thẻ mô tả</label>
                    </div>
                    <LengthBar
                      len={descLen}
                      min={120}
                      max={DESC_CHAR_MAX}
                      px={estimateDescPx(descLen)}
                      pxMax={DESC_PX_MAX}
                    />
                    <Textarea
                      minRows={3}
                      value={metaDescription}
                      onValueChange={onMetaDescriptionChange}
                      placeholder="%excerpt%"
                      classNames={{
                        ...adminInputClassNames,
                        inputWrapper: 'mt-2 bg-white border border-[#8c8f94] shadow-none',
                      }}
                    />
                    <p className="mt-1.5 text-xs text-[#50575e]">
                      Đây là nội dung sẽ xuất hiện làm mô tả khi bài viết này hiển thị trong kết quả tìm kiếm.
                    </p>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
          <div className="flex justify-end pt-4 border-t border-[#dcdcde] mt-2">
            <Button color="primary" size="sm" onPress={onClose}>
              Đóng
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
