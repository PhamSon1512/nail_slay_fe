import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDeleteModal({
  isOpen,
  onOpenChange,
  title = 'Xác nhận xóa',
  message,
  confirmLabel = 'Xóa',
  loading = false,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent className="bg-white dark:bg-[#2a2226]">
        {(onClose) => (
          <>
            <ModalHeader className="text-[#1D1D1D] dark:text-[#FFF3F5]">{title}</ModalHeader>
            <ModalBody>
              <p className="text-sm text-[#1D1D1D] dark:text-[#FFDDE5] leading-relaxed">{message}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" className="text-[#8E8A8A]" onPress={onClose} isDisabled={loading}>
                Hủy
              </Button>
              <Button
                color="danger"
                isLoading={loading}
                onPress={async () => {
                  await onConfirm();
                  onClose();
                }}
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
