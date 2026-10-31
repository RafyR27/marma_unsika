"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import admin from "@/services/admin.service";
import { IOrder } from "@/types/order";

export const useAdminTransactions = () => {
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<IOrder | null>(null);

  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin", "transactions", methodFilter, statusFilter, search, page],
    queryFn: async () => {
      const params: {
        payment_status?: string;
        search?: string;
        page: number;
        per_page: number;
      } = {
        page,
        per_page: 15,
      };

      if (statusFilter !== "all") params.payment_status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await admin.getOrders(params);
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const orders = ordersResponse?.data || [];
  const meta = ordersResponse?.meta;

  const filteredOrders = orders.filter((o) => {
    if (methodFilter === "all") return true;
    return o.payment?.payment_method === methodFilter;
  });

  // Metrik kalkulasi
  const totalVolume = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalPaid = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total_amount, 0);
  const totalUnpaid = orders
    .filter((o) => o.payment_status === "unpaid")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return {
    transactions: filteredOrders,
    meta,
    totalVolume,
    totalPaid,
    totalUnpaid,
    methodFilter,
    setMethodFilter: (m: string) => {
      setMethodFilter(m);
      setPage(1);
    },
    statusFilter,
    setStatusFilter: (s: string) => {
      setStatusFilter(s);
      setPage(1);
    },
    search,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    selectedReceiptOrder,
    setSelectedReceiptOrder,
  };
};
