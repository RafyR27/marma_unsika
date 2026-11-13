import instance from "@/lib/instance";
import { IDeliveryFeeBreakdown } from "@/types/order";

export interface ICalculateFeePayload {
  latitude: number;
  longitude: number;
  origin_latitude?: number;
  origin_longitude?: number;
  items?: Array<{ product_id: number; quantity: number }>;
}

export interface ICalculateFeeResponse {
  message: string;
  data: IDeliveryFeeBreakdown;
}

const delivery = {
  // Calculate delivery fee based on GPS coordinates, road distance, and commodity weight
  calculateFee: (payload: ICalculateFeePayload) =>
    instance.post<ICalculateFeeResponse>("/delivery/calculate-fee", payload),
};

export default delivery;
