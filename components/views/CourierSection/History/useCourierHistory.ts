"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import courier from "@/services/courier.service";

export const useCourierHistory = () => {
  const [page, setPage] = useState<number>(1);

  const {
    data: historyResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courier", "history", page],
    queryFn: async () => {
      const res = await courier.getDeliveries({
        order_status: "completed",
        page,
        per_page: 10,
      });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const completedDeliveries = historyResponse?.data || [];
  const meta = historyResponse?.meta;

  const totalEarnings = completedDeliveries.reduce(
    (sum, d) => sum + (d.delivery_fee || 0),
    0
  );

  return {
    completedDeliveries,
    meta,
    page,
    setPage,
    totalEarnings,
    isLoading,
    isError,
    refetch,
  };
};
