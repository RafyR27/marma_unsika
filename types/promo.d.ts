import { IPaginationLinks, IPaginationMeta } from "./product";

export type PromoDiscountType = "percent" | "fixed" | "free_shipping";

export interface IPromo {
  id: number | string;
  code: string;
  title: string;
  description?: string;
  discount_type: PromoDiscountType;
  discount_value: number;
  min_spend: number;
  max_discount?: number | null;
  quota: number;
  used: number;
  expires_at: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface IPromoQueryParams {
  search?: string;
  is_active?: boolean | string;
  discount_type?: PromoDiscountType;
  page?: number;
  per_page?: number;
}

export interface IPromoListResponse {
  data: IPromo[];
  links?: IPaginationLinks;
  meta?: IPaginationMeta;
}

export interface ISinglePromoResponse {
  message?: string;
  data: IPromo;
}

export interface ICreatePromoRequest {
  code: string;
  title: string;
  description?: string;
  discount_type: PromoDiscountType;
  discount_value: number;
  min_spend: number;
  max_discount?: number;
  quota: number;
  expires_at: string;
  is_active?: boolean;
}

export type IUpdatePromoRequest = Partial<ICreatePromoRequest>;

export interface IValidatePromoRequest {
  code: string;
  subtotal: number;
}

export interface IValidatePromoResponse {
  message: string;
  data: {
    code: string;
    discount_amount: number;
    discount_type: PromoDiscountType;
    final_amount: number;
  };
}

