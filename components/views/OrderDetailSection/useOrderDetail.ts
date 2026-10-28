"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import order from "@/services/order.service";

export const useOrderDetail = (orderNumber: string) => {
  const queryClient = useQueryClient();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const {
    data: orderResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const res = await order.getOrderByNumber(orderNumber);
      return res.data;
    },
    enabled: !!orderNumber,
  });

  const currentOrder = orderResponse?.data;

  const { mutate: executeCancel, isPending: isCancelling } = useMutation({
    mutationFn: async () => {
      const res = await order.cancelOrder(orderNumber, {
        reason: cancelReason || "Dibatalkan oleh pembeli.",
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Pesanan berhasil dibatalkan. Stok telah dikembalikan ke lapak pedagang.", {
        position: "top-right",
      });
      setIsCancelModalOpen(false);
      setCancelReason("");
      queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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

  return {
    orderNumber,
    currentOrder,
    isLoading,
    isError,
    refetch,
    isCancelModalOpen,
    setIsCancelModalOpen,
    cancelReason,
    setCancelReason,
    isCancelling,
    executeCancel,
  };
};
