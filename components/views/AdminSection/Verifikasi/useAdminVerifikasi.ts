"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import admin from "@/services/admin.service";
import { IPayment } from "@/types/payment";

export type VerificationFilterTab = "unverified" | "verified" | "all";

export const useAdminVerifikasi = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<VerificationFilterTab>("unverified");
  const [page, setPage] = useState<number>(1);

  // Modal preview struk
  const [previewPayment, setPreviewPayment] = useState<IPayment | null>(null);

  // Modal reject
  const [rejectingPayment, setRejectingPayment] = useState<IPayment | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  const queryParams: {
    verified?: boolean | string;
    page: number;
    per_page: number;
  } = {
    page,
    per_page: 10,
  };

  if (activeTab === "unverified") queryParams.verified = "false";
  if (activeTab === "verified") queryParams.verified = "true";

  const {
    data: paymentsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin", "payments", activeTab, page],
    queryFn: async () => {
      const res = await admin.getPayments(queryParams);
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    refetchInterval: 15000,
  });

  const payments = paymentsResponse?.data || [];
  const meta = paymentsResponse?.meta;

  // Mutasi Approve
  const { mutate: approvePayment, isPending: isApproving } = useMutation({
    mutationFn: async (paymentId: number) => {
      const res = await admin.verifyPayment(paymentId, { action: "approve" });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        data.message || "Pembayaran disetujui! Pesanan otomatis terkonfirmasi.",
        { position: "top-right" }
      );
      setPreviewPayment(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal menyetujui pembayaran";
      toast.error(msg, { position: "top-right" });
    },
  });

  // Mutasi Reject
  const { mutate: rejectPayment, isPending: isRejecting } = useMutation({
    mutationFn: async ({
      paymentId,
      reason,
    }: {
      paymentId: number;
      reason: string;
    }) => {
      const res = await admin.verifyPayment(paymentId, {
        action: "reject",
        rejection_reason: reason,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Pembayaran telah ditolak.", {
        position: "top-right",
      });
      setRejectingPayment(null);
      setRejectReason("");
      queryClient.invalidateQueries({ queryKey: ["admin", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal menolak pembayaran";
      toast.error(msg, { position: "top-right" });
    },
  });

  return {
    activeTab,
    setActiveTab: (tab: VerificationFilterTab) => {
      setActiveTab(tab);
      setPage(1);
    },
    page,
    setPage,
    payments,
    meta,
    isLoading,
    isError,
    refetch,
    previewPayment,
    setPreviewPayment,
    rejectingPayment,
    setRejectingPayment,
    rejectReason,
    setRejectReason,
    approvePayment,
    isApproving,
    rejectPayment,
    isRejecting,
  };
};
