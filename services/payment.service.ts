import instance from "@/lib/instance";
import { IPaymentResponse, IVerifyPaymentRequest } from "@/types/payment";

const payment = {
  // Buyer: Submit payment method & optional proof for an order
  submitPayment: (orderNumber: string, formData: FormData) =>
    instance.post<IPaymentResponse>(`/orders/${orderNumber}/payment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Buyer/Shared: Get payment detail for an order
  getPaymentStatus: (orderNumber: string) =>
    instance.get<IPaymentResponse>(`/orders/${orderNumber}/payment`),

  // Admin: verify payment proof (approve / reject)
  verifyPayment: (paymentId: number | string, payload: IVerifyPaymentRequest) =>
    instance.post<IPaymentResponse>(`/admin/payments/${paymentId}/verify`, payload),
};

export default payment;
