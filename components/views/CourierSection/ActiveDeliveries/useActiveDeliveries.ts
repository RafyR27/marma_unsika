"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import courier from "@/services/courier.service";
import { PickupStatus } from "@/types/order";

export const useActiveDeliveries = () => {
  const queryClient = useQueryClient();

  const {
    data: deliveriesResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courier", "active-deliveries"],
    queryFn: async () => {
      const res = await courier.getDeliveries();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    refetchInterval: 15000,
  });

  const allDeliveries = deliveriesResponse?.data || [];
  const activeDeliveries = allDeliveries.filter(
    (d) => d.order_status === "picking_up" || d.order_status === "in_transit"
  );

  // Mutasi validasi fisik barang di kios pasar induk
  const { mutate: updatePickup, isPending: isUpdatingPickup } = useMutation({
    mutationFn: async ({
      itemId,
      status,
    }: {
      itemId: number;
      status: PickupStatus;
    }) => {
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
    });

  return {
    activeDeliveries,
    isLoading,
    isError,
    refetch,
    updatePickup,
    isUpdatingPickup,
    updateDeliveryStatus,
    isUpdatingDelivery,
  };
};
