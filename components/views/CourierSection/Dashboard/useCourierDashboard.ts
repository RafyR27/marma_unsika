"use client";

import { useQuery } from "@tanstack/react-query";
import courier from "@/services/courier.service";
import { useMe } from "@/hooks/useMe";

export const useCourierDashboard = () => {
  const { data: user, isLoading: isUserLoading } = useMe();

  // 1. Ambil tugas tersedia
  const {
    data: availableResponse,
    isLoading: isAvailableLoading,
    refetch: refetchAvailable,
  } = useQuery({
    queryKey: ["courier", "available-tasks"],
    queryFn: async () => {
      const res = await courier.getDeliveries({ scope: "available" });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 2. Ambil seluruh pengiriman kurir aktif dan riwayat
  const {
    data: myDeliveriesResponse,
    isLoading: isDeliveriesLoading,
    refetch: refetchMyDeliveries,
  } = useQuery({
    queryKey: ["courier", "my-deliveries"],
    queryFn: async () => {
      const res = await courier.getDeliveries();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const availableTasks = availableResponse?.data || [];
  const myDeliveries = myDeliveriesResponse?.data || [];

  const activeDeliveries = myDeliveries.filter(
    (d) => d.order_status === "picking_up" || d.order_status === "in_transit"
  );

  const completedDeliveries = myDeliveries.filter(
    (d) => d.order_status === "completed"
  );

  const totalEarnings = completedDeliveries.reduce(
    (sum, d) => sum + (d.delivery_fee || 0),
    0
  );

  return {
    user,
    isUserLoading,
    availableTasks,
    isAvailableLoading,
    refetchAvailable,
    activeDeliveries,
    completedDeliveries,
    totalEarnings,
    isDeliveriesLoading,
    refetchMyDeliveries,
  };
};
