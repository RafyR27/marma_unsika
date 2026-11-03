import { IOrder, IPaginationLinks, IPaginationMeta, PickupStatus } from "./order";

export interface ICourierDeliveryQueryParams {
  scope?: "available" | "my_deliveries";
  order_status?: string;
  per_page?: number;
  page?: number;
}

export interface ICourierDeliveriesResponse {
  data: IOrder[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

export interface ICourierDeliveryDetailResponse {
  message?: string;
  data: IOrder;
}

export interface IUpdateItemPickupRequest {
  pickup_status: PickupStatus;
}

export interface IUpdateDeliveryStatusRequest {
  status: "in_transit" | "completed";
}

export interface IMarketHubZone {
  code: string;
  name: string;
  description: string;
  commodityType: string;
  totalStalls: number;
  pickupHub: string;
}

export interface IDeliveryZone {
  zoneName: string;
  coverage: string;
  estimatedTransitTime: string;
  deliveryFee: string;
  activeStalls: number;
}

export interface IMarketHubZonesResponse {
  data: IMarketHubZone[];
}

export interface IDeliveryZonesResponse {
  data: IDeliveryZone[];
}

export interface IUpdateCourierLocationRequest {
  latitude: number;
  longitude: number;
}
