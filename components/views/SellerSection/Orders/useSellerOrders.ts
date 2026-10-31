"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import seller from "@/services/seller.service";
import { PickupStatus } from "@/types/order";

export type SellerOrderTab = "incoming" | "orders";

export const useSellerOrders = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<SellerOrderTab>("incoming");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);

  // 1. Fetch antrean barang yang harus disiapkan / dikemas
  const {
    data: incomingData,
    isLoading: isIncomingLoading,
    isError: isIncomingError,
    refetch: refetchIncoming,
  } = useQuery({
    queryKey: ["seller", "incoming-items"],
    queryFn: async () => {
      const res = await seller.getIncomingItems();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    refetchInterval: 15000, // Polling tiap 15 detik agar penjual update otomatis saat ada order baru
  });

  // 2. Fetch seluruh faktur pesanan masuk
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ["seller", "orders", orderStatusFilter, page],
    queryFn: async () => {
      const params: { order_status?: string; page: number; per_page: number } = {
        page,
        per_page: 10,
      };
      if (orderStatusFilter !== "all") {
        params.order_status = orderStatusFilter;
      }
      const res = await seller.getSellerOrders(params);
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 3. Mutasi update status persiapan komoditas (waiting -> picked_up / out_of_stock)
  const { mutate: updateItemStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: ({
      itemId,
      status,
    }: {
      itemId: number;
      status: PickupStatus;
    }) => seller.updateItemStatus(itemId, { pickup_status: status }),
    onSuccess: (_, variables) => {
      const label =
        variables.status === "picked_up"
          ? "Barang ditandai siap dijemput kurir."
          : variables.status === "out_of_stock"
          ? "Barang ditandai stok kosong."
          : "Status barang diperbarui.";
      toast.success(label, { position: "top-right" });

      queryClient.invalidateQueries({ queryKey: ["seller", "incoming-items"] });
      queryClient.invalidateQueries({ queryKey: ["seller", "orders"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal memperbarui status komoditas";
      toast.error(msg, { position: "top-right" });
    },
  });

  const incomingItems = incomingData?.data || [];
  const orders = ordersData?.data || [];
  const meta = ordersData?.meta;

  return {
    activeTab,
    setActiveTab,
    orderStatusFilter,
    setOrderStatusFilter: (status: string) => {
      setOrderStatusFilter(status);
      setPage(1);
    },
    page,
    setPage,
    incomingItems,
    isIncomingLoading,
    isIncomingError,
    refetchIncoming,
    orders,
    meta,
    isOrdersLoading,
    isOrdersError,
    refetchOrders,
    updateItemStatus,
    isUpdatingStatus,
  };
};
