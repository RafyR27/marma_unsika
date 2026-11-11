import { IAuthUser } from "./user";
import { IOrder, IPaginationLinks, IPaginationMeta } from "./order";
import { IPayment } from "./payment";

export interface IAdminPaymentsQueryParams {
  verified?: boolean | string;
  payment_method?: string;
  per_page?: number;
  page?: number;
}

export interface IAdminPaymentsResponse {
  data: IPayment[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

export interface IVerifyPaymentPayload {
  action: "approve" | "reject";
  rejection_reason?: string;
}

export interface IAdminOrdersQueryParams {
  order_status?: string;
  payment_status?: string;
  unassigned?: boolean | number;
  courier_id?: number;
  buyer_id?: number;
  seller_id?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface IAdminOrdersResponse {
  data: IOrder[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

export interface IAssignCourierPayload {
  courier_id: number;
}

export interface IAdminCancelOrderPayload {
  reason: string;
}

export interface IAdminUsersQueryParams {
  role?: string;
  is_active?: boolean | string;
  search?: string;
  per_page?: number;
  page?: number;
}

export interface IAdminUsersResponse {
  data: IAuthUser[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

export interface IUpdateUserStatusPayload {
  is_active: boolean;
}

export interface ICreateUserPayload {
  name: string;
  phone: string;
  email?: string | null;
  password: string;
  password_confirmation: string;
  role: "buyer" | "seller" | "courier" | "admin";
  store_name?: string | null;
  market_name?: string | null;
  block_number?: string | null;
  full_address?: string | null;
}
