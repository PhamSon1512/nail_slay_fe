import { useState, useRef } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from '@heroui/react';
import toast from 'react-hot-toast';
import { RiStarFill, RiStarLine, RiImageAddLine, RiCloseCircleFill } from 'react-icons/ri';
import { useAtomValue } from 'jotai';
import { authUserAtom } from '~/utils/atoms';
import { createProductReview } from '~/utils/api/reviews';
import { http } from '~/utils/http';

type Props = {
  productId: string;
  onSuccess?: () => void;
};

export function ReviewFormModal({ productId, onSuccess }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const authUser = useAtomValue(authUserAtom);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    if (!authUser) {
      toast.error('Vui lòng đăng nhập để đánh giá sản phẩm.');
      return;
    }
    onOpen();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`Kích thước ảnh ${file.name} không được vượt quá 2MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (files.length + validFiles.length > 5) {
      toast.error('Chỉ được tải lên tối đa 5 ảnh.');
      return;
    }

    setFiles((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Upload images first
      const imageUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'reviews');

        // Assuming /media is the upload endpoint
        const { data } = await http.post<{ url: string }>('/media', formData);
        if (data?.url) {
          imageUrls.push(data.url);
        }
      }

      // Submit review
      await createProductReview({
        productId,
        rating,
        content: content.trim() || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      });

      toast.success('Đánh giá của bạn đã được gửi!');
      setRating(5);
      setContent('');
      setFiles([]);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button color="primary" variant="flat" onPress={handleOpen} className="font-semibold">
        Viết đánh giá
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg" placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Đánh giá sản phẩm</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center gap-2 mb-4">
                  <p className="text-sm font-medium text-default-600">Bạn cảm thấy sản phẩm này thế nào?</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-3xl text-warning hover:scale-110 transition-transform"
                      >
                        {star <= rating ? <RiStarFill /> : <RiStarLine className="text-default-300" />}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-warning">
                    {rating === 5 && 'Tuyệt vời'}
                    {rating === 4 && 'Rất tốt'}
                    {rating === 3 && 'Bình thường'}
                    {rating === 2 && 'Tệ'}
                    {rating === 1 && 'Rất tệ'}
                  </span>
                </div>

                <Textarea
                  label="Nội dung đánh giá"
                  placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này nhé..."
                  value={content}
                  onValueChange={setContent}
                  minRows={3}
                  variant="bordered"
                />

                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button
                    startContent={<RiImageAddLine />}
                    variant="flat"
                    size="sm"
                    onPress={() => fileInputRef.current?.click()}
                    isDisabled={files.length >= 5}
                  >
                    Thêm hình ảnh ({files.length}/5)
                  </Button>
                  
                  {files.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden border border-default-200">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute -top-1 -right-1 text-danger bg-white rounded-full"
                            onClick={() => removeFile(idx)}
                          >
                            <RiCloseCircleFill size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={isLoading}>
                  Hủy
                </Button>
                <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
                  Gửi đánh giá
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
