import instance from "@/lib/instance";
import {
  ICreateReviewRequest,
  IReplyReviewRequest,
  IReviewListResponse,
  IReviewQueryParams,
  ISingleReviewResponse,
} from "@/types/review";

const review = {
  // Ambil ulasan untuk seluruh produk milik pedagang (Seller)
  getSellerReviews: (params?: IReviewQueryParams) =>
    instance.get<IReviewListResponse>("/seller/reviews", { params }),

  // Ambil ulasan spesifik untuk satu komoditas pasar (Public / Buyer)
  getProductReviews: (slugOrId: string | number, params?: IReviewQueryParams) =>
    instance.get<IReviewListResponse>(`/products/${slugOrId}/reviews`, { params }),

  // Kirim ulasan pesanan yang telah diselesaikan (Buyer)
  submitReview: (payload: ICreateReviewRequest) =>
    instance.post<ISingleReviewResponse>("/reviews", payload),

  // Balas ulasan dari pembeli (Seller)
  replyReview: (reviewId: number | string, payload: IReplyReviewRequest) =>
    instance.post<ISingleReviewResponse>(`/seller/reviews/${reviewId}/reply`, payload),
};

export default review;

