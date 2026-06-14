import { Button } from '@heroui/react';
import { useRef, type ChangeEvent } from 'react';
import { RiCloseLine, RiUploadCloud2Line } from 'react-icons/ri';
import { cn } from '~/utils';
import { RequiredLabel } from './RequiredLabel';

interface AdminImageUploadProps {
  label: string;
  required?: boolean;
  onChange: (file: File | null) => void;
  previewUrl?: string;
  className?: string;
  previewClassName?: string;
  onClear?: () => void;
}

export function ImagePreviewClearButton({
  onClear,
  className,
  disabled,
}: {
  onClear: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label="Xóa ảnh"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
      className={cn(
        'absolute -right-1.5 -top-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-[#9E9A9A] text-white shadow-sm transition-colors hover:bg-[#7A7676] disabled:opacity-50',
        className,
      )}
    >
      <RiCloseLine size={14} />
    </button>
  );
}

export function AdminImageUpload({
  label,
  required,
  onChange,
  previewUrl,
  className,
  previewClassName,
  onClear,
}: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
  };

  const handleClear = () => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
    onClear?.();
  };

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
        <RequiredLabel required={required}>{label}</RequiredLabel>
      </div>

      <div className="flex items-center gap-4">
        <Button
          color="primary"
          variant="flat"
          startContent={<RiUploadCloud2Line size={18} />}
          onPress={() => inputRef.current?.click()}
          className="font-medium"
        >
          Tải ảnh lên
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        {previewUrl ? (
          <div className="relative inline-block">
            <img
              key={previewUrl}
              src={previewUrl}
              alt="Preview"
              className={
                previewClassName ??
                'h-12 w-12 rounded border border-primary-200 object-cover'
              }
            />
            <ImagePreviewClearButton onClear={handleClear} />
          </div>
        ) : (
          <span className="text-xs text-[#8E8A8A]">Chưa chọn file nào</span>
        )}
      </div>
    </div>
  );
}
