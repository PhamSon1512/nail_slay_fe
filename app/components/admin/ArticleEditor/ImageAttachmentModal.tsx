import { useRef, useEffect, useState } from 'react';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@heroui/react';
import { RiDeleteBin6Line, RiSave3Line, RiUploadLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

type ImageAttachmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  image: {
    src: string;
    fileName: string;
    alt: string;
    title: string;
  } | null;
  sizeKb: number | null;
  dimensions: { width: number; height: number } | null;
  onSave: (attrs: { alt: string; title: string; caption: string; description: string }) => void;
  onDelete?: (src: string) => void;
  onReplaceFile?: (oldSrc: string, file: File) => Promise<string>;
};

export function ImageAttachmentModal({
  isOpen,
  onClose,
  image,
  sizeKb,
  dimensions,
  onSave,
  onDelete,
  onReplaceFile,
}: ImageAttachmentModalProps) {
  const [alt, setAlt] = useState('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [currentSrc, setCurrentSrc] = useState('');
  const [currentFileName, setCurrentFileName] = useState('');
  const [replacing, setReplacing] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (image) {
      setAlt(image.alt || '');
      setTitle(image.title || '');
      setCaption('');
      setDescription('');
      setCurrentSrc(image.src);
      setCurrentFileName(image.fileName);
    }
  }, [image]);

  if (!image) return null;

  const handleSave = () => {
    onSave({ alt, title, caption, description });
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onReplaceFile) return;
    setReplacing(true);
    try {
      const newUrl = await onReplaceFile(currentSrc, file);
      setCurrentSrc(newUrl);
      setCurrentFileName(file.name);
      toast.success('Đã thay đổi tệp ảnh và tự động tối ưu');
    } catch (err) {
      console.error(err);
      toast.error('Thay đổi tệp ảnh thất bại');
    } finally {
      setReplacing(false);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="border-b border-[#e5e7eb] text-[#1d2327]">
          Chi tiết đính kèm hình ảnh
        </ModalHeader>
        <ModalBody className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
            {/* Left side: Thumbnail & Metadata */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="border border-[#e5e7eb] rounded bg-[#f9fafb] p-2 flex items-center justify-center aspect-square overflow-hidden shadow-inner">
                  <img
                    src={currentSrc}
                    alt={image.alt || 'Thumbnail'}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {onReplaceFile && (
                  <>
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      startContent={<RiUploadLine />}
                      className="w-full text-xs font-semibold justify-center text-[#1d1d1d]"
                      isLoading={replacing}
                      onPress={() => replaceInputRef.current?.click()}
                    >
                      Thay đổi tệp ảnh
                    </Button>
                    <input
                      ref={replaceInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </div>
              <div className="text-xs text-[#50575e] space-y-1.5 bg-[#f3f4f6] p-3 rounded border border-[#e5e7eb]">
                <div className="font-semibold text-gray-700 truncate" title={currentFileName}>
                  {currentFileName}
                </div>
                <div>
                  <span className="text-gray-500">Dung lượng: </span>
                  <span className="font-bold text-gray-800">
                    {sizeKb !== null ? `${sizeKb} KB` : 'Đang đo...'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Độ phân giải: </span>
                  <span className="font-bold text-gray-800">
                    {dimensions ? `${dimensions.width} × ${dimensions.height} pixel` : 'Đang lấy...'}
                  </span>
                </div>
              </div>
              
              {onDelete && (
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  startContent={<RiDeleteBin6Line />}
                  className="w-full text-xs font-semibold justify-start"
                  onPress={() => {
                    onDelete(currentSrc);
                    onClose();
                  }}
                >
                  Xóa khỏi bài viết
                </Button>
              )}
            </div>

            {/* Right side: Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Văn bản thay thế (ALT) <span className="text-danger">*</span>
                </label>
                <Textarea
                  size="sm"
                  variant="bordered"
                  value={alt}
                  onValueChange={setAlt}
                  placeholder="Mô tả mục đích của hình ảnh (vd: bánh biscotti ăn kiêng)"
                  classNames={{ input: 'text-sm' }}
                  minRows={2}
                />
                <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                  Văn bản này giúp người khiếm thị và các công cụ tìm kiếm của Google hiểu được nội dung của hình ảnh.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tiêu đề (Title)</label>
                <Input
                  size="sm"
                  variant="bordered"
                  value={title}
                  onValueChange={setTitle}
                  placeholder="Tiêu đề hình ảnh"
                  classNames={{ input: 'text-sm' }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Chú thích (Caption)</label>
                <Textarea
                  size="sm"
                  variant="bordered"
                  value={caption}
                  onValueChange={setCaption}
                  placeholder="Hiển thị ngay dưới hình ảnh trong nội dung bài viết"
                  classNames={{ input: 'text-sm' }}
                  minRows={2}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mô tả (Description)</label>
                <Textarea
                  size="sm"
                  variant="bordered"
                  value={description}
                  onValueChange={setDescription}
                  placeholder="Thông tin chi tiết thêm về hình ảnh"
                  classNames={{ input: 'text-sm' }}
                  minRows={2}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-[#e5e7eb]">
          <Button variant="light" size="sm" onPress={onClose} className="font-semibold text-gray-600">
            Hủy bỏ
          </Button>
          <Button
            color="primary"
            size="sm"
            startContent={<RiSave3Line />}
            onPress={handleSave}
            className="font-semibold"
          >
            Lưu thay đổi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
