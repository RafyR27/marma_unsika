"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import seller from "@/services/seller.service";
import { toast } from "sonner";

export interface ICommoditySalesSummary {
  name: string;
  totalQuantity: number;
  unit: string;
  totalRevenue: number;
  orderCount: number;
}

export const useSellerEarnings = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [bankDestination, setBankDestination] = useState<string>("BCA - Rekening Utama");

  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["seller", "earnings-orders"],
    queryFn: async () => {
      // Ambil hingga 100 faktur terbaru kios untuk rekap keuangan
      const res = await seller.getSellerOrders({ per_page: 100 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const orders = ordersResponse?.data || [];

  // Hanya pesanan yang sudah completed yang masuk ke omzet tercairkan
  const completedOrders = orders.filter((o) => o.order_status === "completed");

  // Pesanan yang masih berjalan (confirmed, picking_up, in_transit) sebagai estimasi pending
  const inProgressOrders = orders.filter(
    (o) =>
      o.order_status === "confirmed" ||
      o.order_status === "picking_up" ||
      o.order_status === "in_transit"
  );

  // Hitung pendapatan kotor komoditas milik lapak ini
  let totalSettledRevenue = 0;
  let totalPendingRevenue = 0;
  let codRevenue = 0;
  let transferRevenue = 0;

  const commoditySalesMap: Record<string, ICommoditySalesSummary> = {};

  completedOrders.forEach((order) => {
    const isCOD = order.payment?.payment_method === "cod";

    order.items?.forEach((item) => {
      totalSettledRevenue += item.subtotal;
      if (isCOD) {
        codRevenue += item.subtotal;
      } else {
        transferRevenue += item.subtotal;
      }

      const key = item.product_name_snapshot;
      if (!commoditySalesMap[key]) {
        commoditySalesMap[key] = {
          name: key,
          totalQuantity: 0,
          unit: item.unit_snapshot,
          totalRevenue: 0,
          orderCount: 0,
        };
      }
      commoditySalesMap[key].totalQuantity += item.quantity;
      commoditySalesMap[key].totalRevenue += item.subtotal;
      commoditySalesMap[key].orderCount += 1;
    });
  });

  inProgressOrders.forEach((order) => {
    order.items?.forEach((item) => {
      totalPendingRevenue += item.subtotal;
    });
  });

  const topSellingCommodities = Object.values(commoditySalesMap).sort(
    (a, b) => b.totalRevenue - a.totalRevenue
  );

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast.error("Masukkan nominal penarikan yang valid", {
        position: "top-right",
      });
      return;
    }
    if (amount > totalSettledRevenue) {
      toast.error("Nominal penarikan melebihi saldo pendapatan yang siap cair", {
        position: "top-right",
      });
      return;
    }

    toast.success(
      `Permohonan penarikan Rp ${amount.toLocaleString(
        "id-ID"
      )} berhasil diajukan ke bendahara pasar induk! Dana akan ditransfer dalam 1x24 jam kerja.`,
      { position: "top-right" }
    );
    setIsWithdrawModalOpen(false);
    setWithdrawalAmount("");
  };

  return {
    orders,
    completedOrders,
    inProgressOrders,
    totalSettledRevenue,
    totalPendingRevenue,
    codRevenue,
    transferRevenue,
    topSellingCommodities,
    isLoading,
    isError,
    refetch,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    withdrawalAmount,
    setWithdrawalAmount,
    bankDestination,
    setBankDestination,
    handleRequestWithdrawal,
  };
};
