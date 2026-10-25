import { IProduct } from "./product";

interface ICartItem {
  id: number;
  buyer_id: number;
  product_id: number;
  quantity: number;
  subtotal?: number | null;
  formatted_subtotal?: string | null;
  product: IProduct;
  created_at: string;
  updated_at: string;
}

interface ICartSummary {
  total_items: number;
  total_price: number;
  formatted_total_price: string;
}

interface ICartResponse {
  data: ICartItem[];
  summary: ICartSummary;
}

interface ISingleCartItemResponse {
  data: ICartItem;
}

interface IAddToCartRequest {
  product_id: number;
  quantity: number;
}

interface IUpdateCartRequest {
  quantity: number;
}

export type {
  ICartItem,
  ICartSummary,
  ICartResponse,
  ISingleCartItemResponse,
  IAddToCartRequest,
  IUpdateCartRequest,
};
