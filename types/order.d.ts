import { IAuthUser } from "./user";
import { IProduct, IPaginationLinks, IPaginationMeta } from "./product";
import { IPayment } from "./payment";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "picking_up"
  | "in_transit"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid";

export type PickupStatus = "waiting" | "picked_up" | "out_of_stock";

export interface IDeliveryAddress {
  recipient_name: string;
  phone: string;
  store_name?: string | null;
  market_name?: string | null;
  block_number?: string | null;
  full_address: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface IOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  seller_id: number;
  product_name_snapshot: string;
  unit_snapshot: string;
  price_at_purchase: number;
  formatted_price_at_purchase: string;
  quantity: number;
  subtotal: number;
  formatted_subtotal: string;
  pickup_status: PickupStatus;
  seller?: IAuthUser;
  product?: IProduct;
  created_at?: string;
  updated_at?: string;
}

export interface IOrder {
  id: number;
  order_number: string;
  buyer_id: number;
  courier_id: number | null;
  subtotal_products: number;
  formatted_subtotal_products: string;
  delivery_fee: number;
  formatted_delivery_fee: string;
  total_amount: number;
  formatted_total_amount: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_address_snapshot: IDeliveryAddress;
  notes?: string | null;
  ordered_at?: string;
  completed_at?: string | null;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
  buyer?: IAuthUser;
  courier?: IAuthUser | null;
  items?: IOrderItem[];
  payment?: IPayment | null;
  created_at?: string;
  updated_at?: string;
}

export interface ICheckoutRequest {
  delivery_fee?: number;
  notes?: string | null;
  delivery_address?: IDeliveryAddress;
}

export interface ICancelOrderRequest {
  reason?: string;
}

export interface IOrderQueryParams {
  order_status?: OrderStatus | string;
  payment_status?: PaymentStatus | string;
  per_page?: number;
  page?: number;
  search?: string;
  unassigned?: boolean | number;
  date_from?: string;
  date_to?: string;
}

export interface IOrderListResponse {
  data: IOrder[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

export interface ISingleOrderResponse {
  message?: string;
  data: IOrder;
}
