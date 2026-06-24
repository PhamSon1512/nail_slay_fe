import { useRef } from 'react';
import { Button } from '@heroui/react';
import { RiCloseLine, RiUploadCloud2Line } from 'react-icons/ri';

type FeaturedImageBoxProps = {
  previewUrl?: string;
  onChange: (file: File | null) => void;
  onClear: () => void;
};

export function FeaturedImageBox({ previewUrl, onChange, onClear }: FeaturedImageBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear();
  };

  if (!previewUrl) {
    return (
      <div className="space-y-2">
        <Button
          color="primary"
          variant="flat"
          fullWidth
          startContent={<RiUploadCloud2Line />}
          onPress={() => inputRef.current?.click()}
          className="font-medium text-[#1d1d1d]"
        >
          Đặt ảnh đại diện
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-[#50575e]">Chỉ 1 ảnh đại diện cho mỗi bài viết.</p>
      </div>
    );
  }

  return (
    <div className="relative rounded border border-[#c3c4c7] bg-[#fafafa] p-2">
      <img src={previewUrl} alt="Ảnh đại diện" className="w-full max-h-48 object-contain rounded" />
      <button
        type="button"
        aria-label="Xóa ảnh đại diện"
        onClick={handleClear}
        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#9E9A9A] text-white hover:bg-[#7A7676]"
      >
        <RiCloseLine size={14} />
      </button>
      <Button
        size="sm"
        variant="light"
        fullWidth
        className="mt-2 text-[#50575e]"
        onPress={() => inputRef.current?.click()}
      >
        Thay ảnh khác
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
