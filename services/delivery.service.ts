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

export interface ILocationSearchResult {
  name: string;
  display_name: string;
  latitude: number;
  longitude: number;
}

export interface IDetectLocationResponse {
  success: boolean;
  source: string;
  latitude: number;
  longitude: number;
  name: string;
  display_name: string;
}

const delivery = {
  // Calculate delivery fee based on GPS coordinates, road distance, and commodity weight
  calculateFee: (payload: ICalculateFeePayload) =>
    instance.post<ICalculateFeeResponse>("/delivery/calculate-fee", payload),

  // Search locations/landmarks in Karawang
  searchLocation: (query: string) =>
    instance.get<{ data: ILocationSearchResult[] }>("/delivery/search-location", {
      params: { q: query },
    }),

  // Detect user's current location via IP / Profile / Network
  detectLocation: () =>
    instance.get<IDetectLocationResponse>("/delivery/detect-location"),
};

export default delivery;
