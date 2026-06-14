import { Button } from '@heroui/react';
import { useRef, type ChangeEvent } from 'react';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { ImagePreviewClearButton } from './AdminImageUpload';
import { RequiredLabel } from './RequiredLabel';

interface AdminMultipleImageUploadProps {
  label: string;
  required?: boolean;
  maxFiles?: number;
  onChange: (files: File[]) => void;
  previewUrls?: string[];
  onRemoveAt?: (index: number) => void;
  className?: string;
}

export function AdminMultipleImageUpload({
  label,
  required,
  maxFiles = 5,
  onChange,
  previewUrls = [],
  onRemoveAt,
  className,
}: AdminMultipleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;
    const remaining = Math.max(0, maxFiles - previewUrls.length);
    const files = picked.slice(0, remaining);
    if (files.length === 0) return;
    onChange(files);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      <div className="text-sm font-medium text-[#1D1D1D] dark:text-[#FFF3F5]">
        <RequiredLabel required={required}>{label}</RequiredLabel>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Button
            color="primary"
            variant="flat"
            startContent={<RiUploadCloud2Line size={18} />}
            onPress={() => inputRef.current?.click()}
            className="w-fit font-medium"
            isDisabled={previewUrls.length >= maxFiles}
          >
            Tải ảnh lên (Tối đa {maxFiles})
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleChange}
          />
          {previewUrls.length === 0 && (
            <span className="text-xs text-[#8E8A8A]">Chưa chọn file nào</span>
          )}
        </div>

        {previewUrls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previewUrls.map((url, i) => (
              <div key={`${url}-${i}`} className="relative inline-block">
                <img
                  src={url}
                  alt="Preview"
                  className="h-16 w-16 rounded border border-primary-200 object-cover"
                />
                {onRemoveAt ? (
                  <ImagePreviewClearButton onClear={() => onRemoveAt(i)} />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
