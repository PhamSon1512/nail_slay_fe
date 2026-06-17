import { http } from '../http';

export type ProductReview = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  content?: string | null;
  imagesJson?: string | null;
  adminReply?: string | null;
  adminReplyAt?: string | null;
  createdAt?: string | null;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
  } | null;
};

export type PaginationMeta = {
  limit: number;
  offset: number;
  total: number;
};

export async function fetchProductReviews(
  productId: string,
  params?: { limit?: number; offset?: number }
) {
  const { data } = await http.get<{ data: ProductReview[]; pagination: PaginationMeta }>(
    `/reviews/product/${productId}`,
    {
      params: {
        limit: params?.limit?.toString() ?? '10',
        offset: params?.offset?.toString() ?? '0',
      },
    }
  );
  return data;
}

export async function createProductReview(payload: {
  productId: string;
  rating: number;
  content?: string;
  images?: string[];
}) {
  const { data } = await http.post<ProductReview>('/reviews', payload);
  return data;
}

export async function replyToReview(reviewId: string, adminReply: string) {
  const { data } = await http.put<ProductReview>(`/reviews/${reviewId}/reply`, { adminReply });
  return data;
}
