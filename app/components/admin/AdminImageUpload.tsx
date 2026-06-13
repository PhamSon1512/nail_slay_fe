import { Button } from '@heroui/react';
import { useRef, type ChangeEvent } from 'react';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { RequiredLabel } from './RequiredLabel';

interface AdminImageUploadProps {
  label: string;
  required?: boolean;
  onChange: (file: File | null) => void;
  previewUrl?: string;
  className?: string;
}

export function AdminImageUpload({ label, required, onChange, previewUrl, className }: AdminImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
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
          <img
            src={previewUrl}
            alt="Preview"
            className="w-12 h-12 object-cover rounded border border-primary-200"
          />
        ) : (
          <span className="text-xs text-[#8E8A8A]">Chưa chọn file nào</span>
        )}
      </div>
    </div>
  );
}
