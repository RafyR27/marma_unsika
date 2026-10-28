import instance from "@/lib/instance";
import {
  IAdminPaymentsQueryParams,
  IAdminPaymentsResponse,
  IVerifyPaymentPayload,
  IAdminOrdersQueryParams,
  IAdminOrdersResponse,
  IAssignCourierPayload,
  IAdminCancelOrderPayload,
  IAdminUsersQueryParams,
  IAdminUsersResponse,
  IUpdateUserStatusPayload,
} from "@/types/admin";
import { IPayment } from "@/types/payment";
import { IOrder } from "@/types/order";
import { IAuthUser } from "@/types/user";

const admin = {
  // 1. Payments Verification
  getPayments: (params?: IAdminPaymentsQueryParams) =>
    instance.get<IAdminPaymentsResponse>("/admin/payments", { params }),

  verifyPayment: (paymentId: number | string, payload: IVerifyPaymentPayload) =>
    instance.post<{ message: string; data: IPayment }>(
      `/admin/payments/${paymentId}/verify`,
      payload
    ),

  // 2. Orders Management & Dispatching
  getOrders: (params?: IAdminOrdersQueryParams) =>
    instance.get<IAdminOrdersResponse>("/admin/orders", { params }),

  getOrderDetail: (orderNumber: string) =>
    instance.get<{ message?: string; data: IOrder }>(
      `/admin/orders/${orderNumber}`
    ),

  assignCourier: (orderNumber: string, payload: IAssignCourierPayload) =>
    instance.post<{ message: string; data: IOrder }>(
      `/admin/orders/${orderNumber}/assign-courier`,
      payload
    ),

  cancelOrder: (orderNumber: string, payload: IAdminCancelOrderPayload) =>
    instance.post<{ message: string; data: IOrder }>(
      `/admin/orders/${orderNumber}/cancel`,
      payload
    ),

  // 3. Users Management
  getUsers: (params?: IAdminUsersQueryParams) =>
    instance.get<IAdminUsersResponse>("/admin/users", { params }),

  getUserDetail: (userId: number | string) =>
    instance.get<{ data: IAuthUser }>(`/admin/users/${userId}`),

  updateUserStatus: (
    userId: number | string,
    payload: IUpdateUserStatusPayload
  ) =>
    instance.patch<{ message: string; data: IAuthUser }>(
      `/admin/users/${userId}/status`,
      payload
    ),
};

export default admin;
