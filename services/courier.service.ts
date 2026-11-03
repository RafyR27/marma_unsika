import instance from "@/lib/instance";
import {
  ICourierDeliveriesResponse,
  ICourierDeliveryDetailResponse,
  ICourierDeliveryQueryParams,
  IDeliveryZonesResponse,
  IMarketHubZonesResponse,
  IUpdateCourierLocationRequest,
  IUpdateDeliveryStatusRequest,
  IUpdateItemPickupRequest,
} from "@/types/courier";
import { IOrderItem } from "@/types/order";

const courier = {
  // Ambil daftar tugas pengantaran (baik yang tersedia maupun yang sedang aktif)
  getDeliveries: (params?: ICourierDeliveryQueryParams) =>
    instance.get<ICourierDeliveriesResponse>("/courier/deliveries", { params }),

  // Ambil detail rute titik penjemputan kios dan lokasi warung pembeli
  getDeliveryDetail: (orderNumber: string) =>
    instance.get<ICourierDeliveryDetailResponse>(
      `/courier/deliveries/${orderNumber}`
    ),

  // Kurir mengklaim / mengambil order yang siap diantar dari pasar
  claimTask: (orderNumber: string) =>
    instance.post<ICourierDeliveryDetailResponse>(
      `/courier/deliveries/${orderNumber}/claim`
    ),

  // Konfirmasi pengambilan fisik komoditas di kios pedagang pasar
  updateItemPickup: (
    orderItemId: number,
    payload: IUpdateItemPickupRequest
  ) =>
    instance.patch<{ message: string; data: IOrderItem }>(
      `/courier/order-items/${orderItemId}/pickup`,
      payload
    ),

  // Perbarui status pengantaran (in_transit menuju pembeli / completed sampai di tujuan)
  updateDeliveryStatus: (
    orderNumber: string,
    payload: IUpdateDeliveryStatusRequest
  ) =>
    instance.patch<ICourierDeliveryDetailResponse>(
      `/courier/deliveries/${orderNumber}/status`,
      payload
    ),

  // Ambil master zonasi blok pasar induk (Blok A sayur, Blok B bumbu, dsb)
  getMarketHubZones: () =>
    instance.get<IMarketHubZonesResponse>("/courier/market-zones"),

  // Ambil zona dan jangkauan wilayah antar kurir lapangan
  getDeliveryZones: () =>
    instance.get<IDeliveryZonesResponse>("/courier/delivery-zones"),

  // Kirim koordinat lokasi realtime kurir untuk pelacakan pengantaran
  updateLocation: (payload: IUpdateCourierLocationRequest) =>
    instance.post<{ message: string }>("/courier/location", payload),
};

export default courier;
