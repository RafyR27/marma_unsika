import instance from "@/lib/instance";
import { IPaymentResponse, IVerifyPaymentRequest, IPayment } from "@/types/payment";
import { IPaginationLinks, IPaginationMeta } from "@/types/product";

export interface IAdminPaymentsListResponse {
  data: IPayment[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

const payment = {
  // Buyer: Submit payment method & optional proof for an order (COD or Manual Transfer)
  submitPayment: (orderNumber: string, formData: FormData) =>
    instance.post<IPaymentResponse>(`/orders/${orderNumber}/payment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Buyer/Shared: Get payment detail for an order
  getPaymentStatus: (orderNumber: string) =>
    instance.get<IPaymentResponse>(`/orders/${orderNumber}/payment`),

  // Admin: list payments queue
  getAdminPayments: (params?: { verified?: boolean | string; per_page?: number; page?: number }) =>
    instance.get<IAdminPaymentsListResponse>("/admin/payments", { params }),

  // Admin: verify payment (approve/reject)
  verifyPayment: (paymentId: number, payload: IVerifyPaymentRequest) =>
    instance.post<{ message: string; data: IPayment }>(
      `/admin/payments/${paymentId}/verify`,
      payload
    ),
};

export default payment;
