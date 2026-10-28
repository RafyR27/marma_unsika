"use client";

import { useQuery } from "@tanstack/react-query";
import admin from "@/services/admin.service";
import { useMe } from "@/hooks/useMe";

export const useAdminDashboard = () => {
  const { data: user, isLoading: isUserLoading } = useMe();

  // 1. Antrean Verifikasi Bukti Transfer
  const {
    data: unverifiedPaymentsData,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useQuery({
    queryKey: ["admin", "payments", "unverified-count"],
    queryFn: async () => {
      const res = await admin.getPayments({ verified: "false", per_page: 5 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    refetchInterval: 15000,
  });

  // 2. Pesanan Butuh Kurir
  const {
    data: unassignedOrdersData,
    isLoading: isUnassignedLoading,
  } = useQuery({
    queryKey: ["admin", "orders", "unassigned-count"],
    queryFn: async () => {
      const res = await admin.getOrders({ unassigned: 1, per_page: 5 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 3. Total Transaksi Pasar
  const {
    data: allOrdersData,
    isLoading: isAllOrdersLoading,
  } = useQuery({
    queryKey: ["admin", "orders", "total-count"],
    queryFn: async () => {
      const res = await admin.getOrders({ per_page: 5 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 4. Total Pengguna Pasar
  const {
    data: usersData,
    isLoading: isUsersLoading,
  } = useQuery({
    queryKey: ["admin", "users", "total-count"],
    queryFn: async () => {
      const res = await admin.getUsers({ per_page: 1 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const unverifiedPayments = unverifiedPaymentsData?.data || [];
  const pendingVerificationCount = unverifiedPaymentsData?.meta?.total || 0;

  const unassignedOrders = unassignedOrdersData?.data || [];
  const unassignedCount = unassignedOrdersData?.meta?.total || 0;

  const recentOrders = allOrdersData?.data || [];
  const totalOrdersCount = allOrdersData?.meta?.total || 0;

  const totalUsersCount = usersData?.meta?.total || 0;

  return {
    user,
    isUserLoading,
    pendingVerificationCount,
    unverifiedPayments,
    isPaymentsLoading,
    refetchPayments,
    unassignedCount,
    unassignedOrders,
    isUnassignedLoading,
    recentOrders,
    totalOrdersCount,
    isAllOrdersLoading,
    totalUsersCount,
    isUsersLoading,
  };
};
