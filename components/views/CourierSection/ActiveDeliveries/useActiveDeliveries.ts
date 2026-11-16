"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import courier from "@/services/courier.service";
import { PickupStatus } from "@/types/order";

export const useActiveDeliveries = () => {
  const queryClient = useQueryClient();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);
  const [updatingOrderNumber, setUpdatingOrderNumber] = useState<string | null>(null);

  const {
    data: deliveriesResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courier", "active-deliveries"],
    queryFn: async () => {
      // Ambil hingga 50 data agar order aktif tidak tenggelam oleh order yang sudah selesai
      const res = await courier.getDeliveries({ per_page: 50 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    refetchInterval: 15000,
  });

  const allDeliveries = deliveriesResponse?.data || [];

  // Mencegah order 'confirmed' yang ditugaskan manual oleh admin hilang dari pantauan kurir
  const activeDeliveries = allDeliveries.filter(
    (d) =>
      d.order_status === "confirmed" ||
      d.order_status === "picking_up" ||
      d.order_status === "in_transit"
  );

  // Mutasi checklist fisik komoditas di kios lapak
  const { mutate: updatePickup, isPending: isUpdatingPickup } = useMutation({
    mutationFn: async ({
      itemId,
      status,
    }: {
      itemId: number;
      status: PickupStatus;
    }) => {
      setUpdatingItemId(itemId);
      const res = await courier.updateItemPickup(itemId, {
        pickup_status: status,
      });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === "picked_up"
          ? "Barang divalidasi berhasil diambil dari kios."
          : "Barang divalidasi stok kosong di lapak.",
        { position: "top-right" }
      );
      queryClient.invalidateQueries({ queryKey: ["courier"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal memperbarui status penjemputan barang";
      toast.error(msg, { position: "top-right" });
    },
    onSettled: () => {
      setUpdatingItemId(null);
    },
  });

  // Mutasi transisi status pengantaran (in_transit / completed)
  const { mutate: updateDeliveryStatus, isPending: isUpdatingDelivery } =
    useMutation({
      mutationFn: async ({
        orderNumber,
        status,
      }: {
        orderNumber: string;
        status: "in_transit" | "completed";
      }) => {
        setUpdatingOrderNumber(orderNumber);
        const res = await courier.updateDeliveryStatus(orderNumber, { status });
        return res.data;
      },
      onSuccess: (_, variables) => {
        toast.success(
          variables.status === "in_transit"
            ? "Status diubah: Kurir dalam perjalanan menuju warung pembeli."
            : "Pengantaran selesai! Pesanan telah diserahterimakan ke pembeli.",
          { position: "top-right" }
        );
        queryClient.invalidateQueries({ queryKey: ["courier"] });
      },
      onError: (error: unknown) => {
        const err = error as AxiosError<{ message?: string }> | Error;
        const msg =
          (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
          err.message ||
          "Gagal memperbarui status pengantaran";
        toast.error(msg, { position: "top-right" });
      },
      onSettled: () => {
        setUpdatingOrderNumber(null);
      },
    });

  return {
    activeDeliveries,
    isLoading,
    isError,
    refetch,
    updatePickup,
    isUpdatingPickup,
    updatingItemId,
    updateDeliveryStatus,
    isUpdatingDelivery,
    updatingOrderNumber,
  };
};