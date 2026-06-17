import { useEffect, useState } from 'react';
import { Avatar, Button, Pagination, Textarea } from '@heroui/react';
import { useAtomValue } from 'jotai';
import toast from 'react-hot-toast';
import { RiStarFill, RiStarLine } from 'react-icons/ri';
import dayjs from 'dayjs';
import { authUserAtom } from '~/utils/atoms';
import { fetchProductReviews, replyToReview, type ProductReview } from '~/utils/api/reviews';
import { ReviewFormModal } from './ReviewFormModal';

type Props = {
  productId: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-warning text-sm">
      {[1, 2, 3, 4, 5].map((star) => (
        star <= rating ? <RiStarFill key={star} /> : <RiStarLine key={star} className="text-default-300" />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 5;

  const authUser = useAtomValue(authUserAtom);
  const isAdmin = authUser?.role === 'admin';

  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const res = await fetchProductReviews(productId, { limit, offset: (page - 1) * limit });
      setReviews(res.data);
      setTotal(res.pagination.total);
    } catch (error) {
      console.error('Failed to load reviews', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId, page]);

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyContent.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi.');
      return;
    }
    try {
      await replyToReview(reviewId, replyContent);
      toast.success('Đã gửi phản hồi.');
      setReplyingId(null);
      setReplyContent('');
      loadReviews();
    } catch {
      toast.error('Lỗi khi gửi phản hồi.');
    }
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="bg-white dark:bg-[#2a2226] rounded-3xl p-6 lg:p-8 shadow-sm border border-default-100 mt-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-default-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1D1D1D] dark:text-[#FFF3F5] uppercase">Đánh giá sản phẩm</h2>
          <p className="text-sm text-default-500 mt-1">{total} đánh giá</p>
        </div>
        <ReviewFormModal productId={productId} onSuccess={loadReviews} />
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-default-500 text-sm">Đang tải đánh giá...</div>
      ) : reviews.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 mb-4 bg-default-100 rounded-full flex items-center justify-center text-default-300">
            <RiStarLine size={32} />
          </div>
          <p className="text-default-500">Chưa có đánh giá nào cho sản phẩm này.</p>
          <p className="text-sm text-default-400 mt-1">Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            let images: string[] = [];
            try {
              if (review.imagesJson) images = JSON.parse(review.imagesJson);
            } catch (e) {}

            return (
              <div key={review.id} className="flex gap-4 border-b border-default-100 pb-6 last:border-0 last:pb-0">
                <Avatar src={review.user?.avatar || undefined} name={review.user?.firstName || 'U'} className="shrink-0" />
                <div className="flex-1 space-y-2">
                  <div>
                    <div className="text-sm font-semibold text-default-900">
                      {review.user?.firstName} {review.user?.lastName}
                    </div>
                    <StarRating rating={review.rating} />
                    <div className="text-xs text-default-400 mt-1">
                      {dayjs(review.createdAt).format('DD/MM/YYYY HH:mm')}
                    </div>
                  </div>

                  {review.content && <p className="text-sm text-default-700 whitespace-pre-wrap">{review.content}</p>}

                  {images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {images.map((img, idx) => (
                        <img key={idx} src={img} alt="Review" className="w-20 h-20 object-cover rounded-md border border-default-200" />
                      ))}
                    </div>
                  )}

                  {review.adminReply && (
                    <div className="mt-3 bg-default-50 p-4 rounded-xl relative">
                      <div className="absolute top-0 left-4 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-transparent border-b-default-50 -mt-2"></div>
                      <p className="text-xs font-semibold text-default-900 mb-1">Phản hồi của Người Bán</p>
                      <p className="text-sm text-default-600 whitespace-pre-wrap">{review.adminReply}</p>
                    </div>
                  )}

                  {isAdmin && !review.adminReply && replyingId !== review.id && (
                    <div className="mt-2">
                      <Button size="sm" variant="flat" onPress={() => setReplyingId(review.id)}>
                        Phản hồi đánh giá
                      </Button>
                    </div>
                  )}

                  {replyingId === review.id && (
                    <div className="mt-3 bg-default-50 p-4 rounded-xl border border-default-200 space-y-3">
                      <p className="text-xs font-semibold">Nhập phản hồi của bạn:</p>
                      <Textarea
                        value={replyContent}
                        onValueChange={setReplyContent}
                        placeholder="Cảm ơn bạn đã ủng hộ..."
                        minRows={2}
                      />
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="light" onPress={() => setReplyingId(null)}>Hủy</Button>
                        <Button size="sm" color="primary" onPress={() => handleReplySubmit(review.id)}>Gửi</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-8 flex justify-end">
          <Pagination total={pages} page={page} onChange={setPage} showControls />
        </div>
      )}
    </div>
  );
}
