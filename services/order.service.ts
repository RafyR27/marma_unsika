import instance from "@/lib/instance";
import {
  ICheckoutRequest,
  ICancelOrderRequest,
  IOrderListResponse,
  IOrderQueryParams,
  ISingleOrderResponse,
} from "@/types/order";

const order = {
  // Buyer: get my orders
  getOrders: (params?: IOrderQueryParams) =>
    instance.get<IOrderListResponse>("/orders", { params }),

  // Shared: get order detail by order number
  getOrderByNumber: (orderNumber: string) =>
    instance.get<ISingleOrderResponse>(`/orders/${orderNumber}`),

  // Buyer: checkout cart items into a new order
  checkout: (payload: ICheckoutRequest) =>
    instance.post<ISingleOrderResponse>("/orders/checkout", payload),

  // Buyer/Admin: cancel a pending order
  cancelOrder: (orderNumber: string, payload?: ICancelOrderRequest) =>
    instance.post<ISingleOrderResponse>(`/orders/${orderNumber}/cancel`, payload),
};

export default order;
