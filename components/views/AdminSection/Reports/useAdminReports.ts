"use client";

import { useQuery } from "@tanstack/react-query";
import admin from "@/services/admin.service";
import category from "@/services/category.service";

export interface ITopStallPerformance {
  storeName: string;
  marketName: string;
  totalOrders: number;
  totalRevenue: number;
}

export interface ITopCommodityAnalytics {
  name: string;
  unit: string;
  quantitySold: number;
  revenue: number;
}

export const useAdminReports = () => {
  // Ambil sample data 100 pesanan terakhir untuk analitik pasar komprehensif
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["admin", "reports-orders"],
    queryFn: async () => {
      const res = await admin.getOrders({ per_page: 100 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // Ambil kategori untuk data komparasi
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await category.getCategories();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const orders = ordersResponse?.data || [];
  const categories = categoriesResponse?.data || [];

  // Metrik Utama
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.order_status === "completed");
  const cancelledOrders = orders.filter((o) => o.order_status === "cancelled");
  const inProgressOrders = orders.filter(
    (o) =>
      o.order_status === "confirmed" ||
      o.order_status === "picking_up" ||
      o.order_status === "in_transit"
  );

  const totalGMV = completedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalDeliveryFees = completedOrders.reduce((sum, o) => sum + o.delivery_fee, 0);
  const totalCommoditiesTurnover = completedOrders.reduce(
    (sum, o) => sum + o.subtotal_products,
    0
  );

  const averageOrderValue =
    completedOrders.length > 0 ? Math.round(totalGMV / completedOrders.length) : 0;

  const successRate =
    totalOrders > 0
      ? Math.round((completedOrders.length / totalOrders) * 100)
      : 100;

  // Analisis Komoditas Terlaris di Pasar
  const commodityMap: Record<string, ITopCommodityAnalytics> = {};
  const stallMap: Record<string, ITopStallPerformance> = {};

  completedOrders.forEach((o) => {
    o.items?.forEach((item) => {
      // Komoditas
      const cName = item.product_name_snapshot;
      if (!commodityMap[cName]) {
        commodityMap[cName] = {
          name: cName,
          unit: item.unit_snapshot,
          quantitySold: 0,
          revenue: 0,
        };
      }
      commodityMap[cName].quantitySold += item.quantity;
      commodityMap[cName].revenue += item.subtotal;

      // Kios Lapak
      const sName = item.seller?.profile?.store_name || item.seller?.name || "Kios Pasar";
      const mName = item.seller?.profile?.market_name || "Pasar Induk";
      if (!stallMap[sName]) {
        stallMap[sName] = {
          storeName: sName,
          marketName: mName,
          totalOrders: 0,
          totalRevenue: 0,
        };
      }
      stallMap[sName].totalOrders += 1;
      stallMap[sName].totalRevenue += item.subtotal;
    });
  });

  const topCommodities = Object.values(commodityMap).sort(
    (a, b) => b.revenue - a.revenue
  );

  const topStalls = Object.values(stallMap).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  return {
    totalOrders,
    completedOrdersCount: completedOrders.length,
    cancelledOrdersCount: cancelledOrders.length,
    inProgressOrdersCount: inProgressOrders.length,
    totalGMV,
    totalDeliveryFees,
    totalCommoditiesTurnover,
    averageOrderValue,
    successRate,
    topCommodities,
    topStalls,
    categoriesCount: categories.length,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  };
};
