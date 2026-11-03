import { IAuthUser } from "./user";
import { IProduct, IPaginationLinks, IPaginationMeta } from "./product";

export interface IReviewReply {
  id?: number | string;
  comment: string;
  replied_at: string;
  seller?: IAuthUser;
}

export interface IReview {
  id: number | string;
  buyer_id?: number;
  seller_id?: number;
  product_id?: number;
  order_item_id?: number;
  rating: number;
  comment: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  buyer?: IAuthUser;
  product?: IProduct;
  reply?: IReviewReply | null;
}

export interface IReviewQueryParams {
  rating?: number;
  product_id?: number | string;
  seller_id?: number | string;
  page?: number;
  per_page?: number;
  sort?: "latest" | "highest" | "lowest";
}

export interface IReviewListResponse {
  data: IReview[];
  links?: IPaginationLinks;
  meta?: IPaginationMeta;
}

export interface ISingleReviewResponse {
  message?: string;
  data: IReview;
}

export interface ICreateReviewRequest {
  order_item_id: number;
  rating: number;
  comment: string;
  tags?: string[];
}

export interface IReplyReviewRequest {
  comment: string;
}

