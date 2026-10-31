import instance from "@/lib/instance";
import {
  IIncomingItemsResponse,
  ISellerOrdersResponse,
  ISellerOrderQueryParams,
  IUpdateSellerItemStatusRequest,
} from "@/types/seller";
import { IOrderItem } from "@/types/order";

const seller = {
  // Get all orders containing products from this seller
  getSellerOrders: (params?: ISellerOrderQueryParams) =>
    instance.get<ISellerOrdersResponse>("/seller/orders", { params }),

  // Get commodities that are waiting to be packed for confirmed/picking_up orders
  getIncomingItems: () =>
    instance.get<IIncomingItemsResponse>("/seller/incoming-items"),

  // Update packaging/readiness status of an order item (waiting / picked_up / out_of_stock)
  updateItemStatus: (orderItemId: number, payload: IUpdateSellerItemStatusRequest) =>
    instance.patch<{ message: string; data: IOrderItem }>(
      `/seller/order-items/${orderItemId}/status`,
      payload
    ),
};

export default seller;
