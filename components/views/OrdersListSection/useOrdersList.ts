"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import order from "@/services/order.service";
import { OrderStatus } from "@/types/order";

export type OrderFilterTab =
  | "all"
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export const useOrdersList = () => {
  const [activeTab, setActiveTab] = useState<OrderFilterTab>("all");
  const [page, setPage] = useState(1);

  const queryParams: {
    order_status?: OrderStatus | string;
    page: number;
    per_page: number;
  } = {
    page,
    per_page: 10,
  };

  if (activeTab === "pending") queryParams.order_status = "pending";
  if (activeTab === "confirmed") queryParams.order_status = "confirmed";
  if (activeTab === "completed") queryParams.order_status = "completed";
  if (activeTab === "cancelled") queryParams.order_status = "cancelled";

  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", activeTab, page],
    queryFn: async () => {
      const res = await order.getOrders(queryParams);
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const orders = ordersResponse?.data || [];
  const meta = ordersResponse?.meta;

  // Filter khusus untuk in_progress jika tab in_progress
  const filteredOrders =
    activeTab === "in_progress"
      ? orders.filter(
          (o) => o.order_status === "picking_up" || o.order_status === "in_transit"
        )
      : orders;

  return {
    orders: filteredOrders,
    meta,
    activeTab,
    setActiveTab: (tab: OrderFilterTab) => {
      setActiveTab(tab);
      setPage(1);
    },
    page,
    setPage,
    isLoading,
    isError,
    refetch,
  };
};
