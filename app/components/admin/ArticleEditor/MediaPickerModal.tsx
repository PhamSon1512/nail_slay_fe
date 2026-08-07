import { useRef, useState } from 'react';
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { uploadContentAsset } from '~/utils/api/admin';

type MediaPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (payload: { url: string; mimeType: string; fileName: string }) => void;
};

// Hàm chuẩn hóa tên file SEO (không dấu, cách nhau bằng gạch ngang)
function sanitizeFilename(name: string): string {
  const ext = name.split('.').pop() || '';
  const base = name.substring(0, name.lastIndexOf('.')) || name;
  const slug = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Gỡ dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-') // Đổi các ký tự đặc biệt thành dấu gạch ngang
    .replace(/^-+|-+$/g, ''); // Xóa dấu gạch đầu/cuối
  return `${slug || 'image'}.${ext}`;
}

// Hàm nén ảnh client-side bằng canvas
function compressImage(file: File, maxKb: number = 100): Promise<File> {
  return new Promise((resolve) => {
    if (file.size <= maxKb * 1024 || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Giới hạn chiều rộng/dài tối đa 1600px
        const MAX_DIM = 1600;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        // Chuyển sang Jpeg để nén tốt hơn
        const type = file.type === 'image/png' ? 'image/jpeg' : file.type;
        
        const attemptCompression = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              if (blob.size <= maxKb * 1024 || quality <= 0.1) {
                const ext = type.split('/').pop() || 'jpg';
                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const newName = `${originalName}.${ext}`;
                resolve(new File([blob], newName, { type, lastModified: Date.now() }));
              } else {
                quality -= 0.1;
                attemptCompression();
              }
            },
            type,
            quality
          );
        };

        attemptCompression();
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function MediaPickerModal({ isOpen, onClose, onInsert }: MediaPickerModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(true);

  const handleFiles = async (files: FileList | null) => {
    let file = files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      if (autoOptimize && file.type.startsWith('image/')) {
        // 1. Tự động đổi tên file sang dạng không dấu chuẩn SEO
        const seoName = sanitizeFilename(file.name);
        const renamedFile = new File([file], seoName, { type: file.type });
        
        // 2. Tự động nén ảnh client-side nếu > 100KB
        file = await compressImage(renamedFile, 100);
      }
      
      const result = await uploadContentAsset(file);
      onInsert(result);
      onClose();
    } catch (err) {
      console.error('Lỗi khi tải ảnh lên:', err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="text-[#1d2327]">Thêm tệp</ModalHeader>
        <ModalBody className="space-y-4">
          <p className="text-sm text-[#50575e]">
            Tải lên ảnh, nhạc, video hoặc tài liệu để chèn vào nội dung bài viết.
          </p>
          
          <div className="bg-[#f9fafb] p-3 rounded-lg border border-[#e5e7eb] space-y-2">
            <Checkbox 
              isSelected={autoOptimize} 
              onValueChange={setAutoOptimize}
              classNames={{ label: 'text-xs font-semibold text-gray-700' }}
            >
              Tự động tối ưu SEO ảnh trước khi upload
            </Checkbox>
            <p className="text-[11px] text-gray-500 leading-normal pl-7">
              Hệ thống sẽ tự động đổi tên file không dấu (vd: <span className="font-mono text-primary-600">banh-biscotti.jpg</span>) và nén dung lượng xuống dưới <span className="font-bold">100KB</span>.
            </p>
          </div>

          <Button
            color="primary"
            variant="flat"
            startContent={<RiUploadCloud2Line />}
            isLoading={uploading}
            onPress={() => inputRef.current?.click()}
            className="font-semibold text-[#1d1d1d] w-full"
          >
            Chọn tệp từ máy
          </Button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*,audio/*,video/mp4,video/webm,.pdf,.zip,.doc,.docx"
            onChange={(e) => void handleFiles(e.target.files)}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

