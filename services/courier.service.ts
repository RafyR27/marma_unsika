import instance from "@/lib/instance";
import {
  ICourierDeliveriesResponse,
  ICourierDeliveryDetailResponse,
  ICourierDeliveryQueryParams,
  IUpdateDeliveryStatusRequest,
  IUpdateItemPickupRequest,
} from "@/types/courier";
import { IOrderItem } from "@/types/order";

const courier = {
  // Get deliveries assigned or available
  getDeliveries: (params?: ICourierDeliveryQueryParams) =>
    instance.get<ICourierDeliveriesResponse>("/courier/deliveries", { params }),

  // Get single delivery detail with route points
  getDeliveryDetail: (orderNumber: string) =>
    instance.get<ICourierDeliveryDetailResponse>(
      `/courier/deliveries/${orderNumber}`
    ),

  // Courier claims an available confirmed order
  claimTask: (orderNumber: string) =>
    instance.post<ICourierDeliveryDetailResponse>(
      `/courier/deliveries/${orderNumber}/claim`
    ),

  // Update physical pickup status of an item at a stall
  updateItemPickup: (
    orderItemId: number,
    payload: IUpdateItemPickupRequest
  ) =>
    instance.patch<{ message: string; data: IOrderItem }>(
      `/courier/order-items/${orderItemId}/pickup`,
      payload
    ),

  // Update overall delivery lifecycle status (in_transit / completed)
  updateDeliveryStatus: (
    orderNumber: string,
    payload: IUpdateDeliveryStatusRequest
  ) =>
    instance.patch<ICourierDeliveryDetailResponse>(
      `/courier/deliveries/${orderNumber}/status`,
      payload
    ),
};

export default courier;
