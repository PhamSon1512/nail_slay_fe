import { Input, Textarea } from '@heroui/react';
import { AdminImageUpload } from '~/components/admin/AdminImageUpload';
import { adminInputClassNames } from '~/utils/adminForm';

type SeoSocialProps = {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string | null;
  ogImageFile: File | null;
  onOgImageFileChange: (f: File | null) => void;
  onRemoveOgImage: () => void;
};

export function SeoSocial({
  metaTitle,
  metaDescription,
  ogImageUrl,
  ogImageFile,
  onOgImageFileChange,
  onRemoveOgImage,
}: SeoSocialProps) {
  const preview = ogImageFile ? URL.createObjectURL(ogImageFile) : ogImageUrl ?? undefined;

  return (
    <div className="space-y-4">
      <Input label="OG Title" value={metaTitle} isReadOnly description="Dùng Meta Title" classNames={adminInputClassNames} />
      <Textarea
        label="OG Description"
        value={metaDescription}
        isReadOnly
        description="Dùng Meta Description"
        minRows={2}
        classNames={adminInputClassNames}
      />
      <AdminImageUpload
        label="Ảnh Open Graph (1200×630)"
        onChange={onOgImageFileChange}
        previewUrl={preview}
        onClear={onRemoveOgImage}
      />
      <div className="rounded-lg border border-[#E8E4E4] p-3 bg-[#FAFAFA]">
        <p className="text-xs text-[#8E8A8A] mb-2">Facebook preview</p>
        {preview && <img src={preview} alt="" className="w-full max-h-40 object-cover rounded-md mb-2" />}
        <p className="text-sm font-semibold text-[#2D2A2A] line-clamp-2">{metaTitle || 'Tiêu đề'}</p>
        <p className="text-xs text-[#8E8A8A] line-clamp-2">{metaDescription || 'Mô tả'}</p>
      </div>
    </div>
  );
}
