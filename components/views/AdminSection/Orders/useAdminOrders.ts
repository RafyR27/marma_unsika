"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import admin from "@/services/admin.service";
import { IOrder } from "@/types/order";

export const useAdminOrders = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [unassignedOnly, setUnassignedOnly] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Modal assign kurir
  const [assigningOrder, setAssigningOrder] = useState<IOrder | null>(null);
  const [selectedCourierId, setSelectedCourierId] = useState<number | "">("");

  // Modal cancel darurat
  const [cancellingOrder, setCancellingOrder] = useState<IOrder | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");

  // 1. Fetch seluruh pesanan
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: [
      "admin",
      "orders",
      statusFilter,
      unassignedOnly,
      search,
      page,
    ],
    queryFn: async () => {
      const params: {
        order_status?: string;
        unassigned?: number;
        search?: string;
        page: number;
        per_page: number;
      } = {
        page,
        per_page: 10,
      };

      if (statusFilter !== "all") params.order_status = statusFilter;
      if (unassignedOnly) params.unassigned = 1;
      if (search.trim()) params.search = search.trim();

      const res = await admin.getOrders(params);
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 2. Fetch kurir aktif untuk dropdown dispatching
  const { data: couriersResponse } = useQuery({
    queryKey: ["admin", "active-couriers"],
    queryFn: async () => {
      const res = await admin.getUsers({ role: "courier", is_active: true, per_page: 50 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const orders = ordersResponse?.data || [];
  const meta = ordersResponse?.meta;
  const couriers = couriersResponse?.data || [];

  // Mutasi Assign Kurir
  const { mutate: executeAssignCourier, isPending: isAssigning } = useMutation({
    mutationFn: async ({
      orderNumber,
      courierId,
    }: {
      orderNumber: string;
      courierId: number;
    }) => {
      const res = await admin.assignCourier(orderNumber, {
        courier_id: courierId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Kurir berhasil ditugaskan ke pesanan.", {
        position: "top-right",
      });
      setAssigningOrder(null);
      setSelectedCourierId("");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal menugaskan kurir";
      toast.error(msg, { position: "top-right" });
    },
  });

  // Mutasi Batal Darurat
  const { mutate: executeCancelOrder, isPending: isCancelling } = useMutation({
    mutationFn: async ({
      orderNumber,
      reason,
    }: {
      orderNumber: string;
      reason: string;
    }) => {
      const res = await admin.cancelOrder(orderNumber, { reason });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "Pesanan dibatalkan. Stok otomatis dipulihkan ke kios pedagang.",
        { position: "top-right" }
      );
      setCancellingOrder(null);
      setCancelReason("");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal membatalkan pesanan";
      toast.error(msg, { position: "top-right" });
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return {
    orders,
    meta,
    couriers,
    statusFilter,
    setStatusFilter: (st: string) => {
      setStatusFilter(st);
      setPage(1);
    },
    unassignedOnly,
    setUnassignedOnly: (val: boolean) => {
      setUnassignedOnly(val);
      setPage(1);
    },
    search,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    page,
    setPage,
    isOrdersLoading,
    isOrdersError,
    refetchOrders,
    assigningOrder,
    setAssigningOrder,
    selectedCourierId,
    setSelectedCourierId,
    executeAssignCourier,
    isAssigning,
    cancellingOrder,
    setCancellingOrder,
    cancelReason,
    setCancelReason,
    executeCancelOrder,
    isCancelling,
  };
};
