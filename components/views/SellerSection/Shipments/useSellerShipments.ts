"use client";

import { useQuery } from "@tanstack/react-query";
import seller from "@/services/seller.service";

export const useSellerShipments = () => {
  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["seller", "shipments"],
    queryFn: async () => {
      const res = await seller.getSellerOrders({ per_page: 50 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    refetchInterval: 15000,
  });

  const allOrders = ordersResponse?.data || [];

  // Filter khusus pesanan dalam proses logistik pengiriman
  const activeShipments = allOrders.filter(
    (o) => o.order_status === "picking_up" || o.order_status === "in_transit"
  );

  const completedShipments = allOrders.filter(
    (o) => o.order_status === "completed"
  );

  return {
    activeShipments,
    completedShipments,
    isLoading,
    isError,
    refetch,
  };
};
