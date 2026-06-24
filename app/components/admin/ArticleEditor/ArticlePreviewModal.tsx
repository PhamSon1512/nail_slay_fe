import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
import { RichContent } from '~/components/store/RichContent';
import { formatPublishDateVi } from '~/utils/format';

export type ArticlePreviewData = {
  title: string;
  excerpt: string;
  content: string;
  coverPreview: string | null;
  tagNames: string[];
  publishedAt?: string | null;
};

type ArticlePreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: ArticlePreviewData;
};

export function ArticlePreviewModal({ isOpen, onClose, data }: ArticlePreviewModalProps) {
  const dateLabel = data.publishedAt
    ? formatPublishDateVi(data.publishedAt)
    : formatPublishDateVi(new Date());

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="border-b border-[#e8e4e4]">Xem trước bài viết</ModalHeader>
        <ModalBody className="py-6">
          <article className="max-w-3xl mx-auto space-y-6">
            {data.coverPreview ? (
              <img
                src={data.coverPreview}
                alt={data.title}
                className="w-full rounded-2xl border border-primary-200/70 object-cover max-h-[420px]"
              />
            ) : null}
            <header className="space-y-2">
              <p className="text-sm text-[#8E8A8A]">{dateLabel}</p>
              <h1 className="font-heading text-3xl font-bold text-[#1D1D1D]">{data.title || 'Tiêu đề bài viết'}</h1>
              {data.excerpt ? <p className="text-base text-[#8E8A8A]">{data.excerpt}</p> : null}
              {data.tagNames.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.tagNames.map((t) => (
                    <span key={t} className="text-xs rounded-full bg-primary-50 px-2 py-0.5 text-primary-700">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </header>
            <RichContent html={data.content || '<p>Nội dung bài viết...</p>'} />
          </article>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
