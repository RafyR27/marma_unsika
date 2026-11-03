import instance from "@/lib/instance";
import {
  ICreatePromoRequest,
  IPromoListResponse,
  IPromoQueryParams,
  ISinglePromoResponse,
  IUpdatePromoRequest,
  IValidatePromoRequest,
  IValidatePromoResponse,
} from "@/types/promo";

const promo = {
  // Admin: Ambil daftar seluruh voucher promo
  getPromos: (params?: IPromoQueryParams) =>
    instance.get<IPromoListResponse>("/admin/promos", { params }),

  // Admin: Ambil detail voucher promo
  getPromoDetail: (id: string | number) =>
    instance.get<ISinglePromoResponse>(`/admin/promos/${id}`),

  // Admin: Buat kupon promo baru
  createPromo: (payload: ICreatePromoRequest) =>
    instance.post<ISinglePromoResponse>("/admin/promos", payload),

  // Admin: Perbarui kupon promo
  updatePromo: (id: string | number, payload: IUpdatePromoRequest) =>
    instance.put<ISinglePromoResponse>(`/admin/promos/${id}`, payload),

  // Admin: Hapus kupon promo
  deletePromo: (id: string | number) =>
    instance.delete<{ message: string }>(`/admin/promos/${id}`),

  // Admin: Toggle status aktif/nonaktif kupon
  togglePromoStatus: (id: string | number, isActive: boolean) =>
    instance.patch<ISinglePromoResponse>(`/admin/promos/${id}/status`, {
      is_active: isActive,
    }),

  // Buyer: Validasi kode promo saat proses checkout belanja
  validatePromo: (payload: IValidatePromoRequest) =>
    instance.post<IValidatePromoResponse>("/promos/validate", payload),
};

export default promo;

