import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { adminInputClassNames } from '~/utils/adminForm';

export type LinkInsertValues = {
  url: string;
  text: string;
};

type LinkInsertModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  initialText?: string;
  onSubmit: (values: LinkInsertValues) => void;
};

export function LinkInsertModal({
  isOpen,
  onClose,
  initialUrl = '',
  initialText = '',
  onSubmit,
}: LinkInsertModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (!isOpen) return;
    setUrl(initialUrl);
    setText(initialText);
  }, [isOpen, initialUrl, initialText]);

  const handleSubmit = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    onSubmit({ url: trimmedUrl, text: text.trim() || trimmedUrl });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span>Chèn / sửa liên kết</span>
          <span className="text-xs font-normal text-[#50575e]">
            Nhập URL và văn bản hiển thị. Giữ Ctrl + click để mở liên kết khi xem trong trình soạn thảo.
          </span>
        </ModalHeader>
        <ModalBody className="gap-4">
          <Input
            label="Đường liên kết (URL)"
            placeholder="https://nailslaystudio.com/articles/..."
            value={url}
            onValueChange={setUrl}
            classNames={adminInputClassNames}
          />
          <Input
            label="Văn bản hiển thị"
            placeholder="Nội dung hiển thị trên liên kết"
            value={text}
            onValueChange={setText}
            description="Để trống sẽ dùng URL làm văn bản hiển thị."
            classNames={adminInputClassNames}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Hủy
          </Button>
          <Button color="primary" onPress={handleSubmit} isDisabled={!url.trim()}>
            Áp dụng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
