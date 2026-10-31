"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import courier from "@/services/courier.service";

export const useAvailableTasks = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: deliveriesResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courier", "available-tasks"],
    queryFn: async () => {
      const res = await courier.getDeliveries({ scope: "available" });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    refetchInterval: 10000, // Polling setiap 10 detik agar kurir lapangan sigap menerima tugas baru
  });

  const { mutate: executeClaim, isPending: isClaiming } = useMutation({
    mutationFn: async (orderNumber: string) => {
      const res = await courier.claimTask(orderNumber);
      return res.data;
    },
    onSuccess: (data) => {
      const orderNumber = data.data.order_number;
      toast.success(
        `Pesanan #${orderNumber} berhasil diklaim! Silakan menuju blok kios pasar induk untuk menjemput barang.`,
        { position: "top-right" }
      );
      queryClient.invalidateQueries({ queryKey: ["courier"] });
      router.push("/courier/active-deliveries");
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal mengklaim tugas pengantaran";
      toast.error(msg, { position: "top-right" });
    },
  });

  const availableTasks = deliveriesResponse?.data || [];

  return {
    availableTasks,
    isLoading,
    isError,
    refetch,
    executeClaim,
    isClaiming,
  };
};
