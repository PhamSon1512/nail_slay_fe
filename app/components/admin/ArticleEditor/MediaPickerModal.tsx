import { useRef, useState } from 'react';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import { RiUploadCloud2Line } from 'react-icons/ri';
import { uploadContentAsset } from '~/utils/api/admin';

type MediaPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (payload: { url: string; mimeType: string; fileName: string }) => void;
};

export function MediaPickerModal({ isOpen, onClose, onInsert }: MediaPickerModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadContentAsset(file);
      onInsert(result);
      onClose();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="text-[#1d2327]">Thêm tệp</ModalHeader>
        <ModalBody className="space-y-3">
          <p className="text-sm text-[#50575e]">
            Tải lên ảnh, nhạc, video hoặc tài liệu để chèn vào nội dung bài viết.
          </p>
          <Button
            color="primary"
            variant="flat"
            startContent={<RiUploadCloud2Line />}
            isLoading={uploading}
            onPress={() => inputRef.current?.click()}
            className="font-semibold text-[#1d1d1d]"
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
