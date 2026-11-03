import { IOrder, IOrderItem, IPaginationLinks, IPaginationMeta, PickupStatus } from "./order";

export interface IIncomingOrderItem extends IOrderItem {
  order?: IOrder;
}

export interface IIncomingItemsResponse {
  data: IIncomingOrderItem[];
}

export interface ISellerOrdersResponse {
  data: IOrder[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

export interface IUpdateSellerItemStatusRequest {
  pickup_status: PickupStatus;
}

export interface ISellerOrderQueryParams {
  order_status?: string;
  page?: number;
  per_page?: number;
}
