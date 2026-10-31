import { IAuthUser } from "./user";
import { IOrder } from "./order";

export type PaymentMethod = "cod" | "manual_transfer";

export interface IPayment {
  id: number;
  order_id: number;
  payment_method: PaymentMethod;
  amount_paid: number;
  formatted_amount_paid: string;
  payment_proof_url: string | null;
  verified_by: number | null;
  verifier?: IAuthUser | null;
  paid_at: string | null;
  external_reference_id?: string | null;
  order?: IOrder;
  created_at?: string;
  updated_at?: string;
}

export interface IPaymentResponse {
  message?: string;
  data: IPayment;
}

export interface IVerifyPaymentRequest {
  action: "approve" | "reject";
  rejection_reason?: string;
}
