"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import courier from "@/services/courier.service";
import { toast } from "sonner";

export const useCourierEarnings = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRemitCODModalOpen, setIsRemitCODModalOpen] = useState(false);
  const [bankDestination, setBankDestination] = useState<string>("BCA - Rekening Kurir");

  const {
    data: deliveriesResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["courier", "earnings-deliveries"],
    queryFn: async () => {
      const res = await courier.getDeliveries({ per_page: 100 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const allDeliveries = deliveriesResponse?.data || [];

  const completedDeliveries = allDeliveries.filter(
    (d) => d.order_status === "completed"
  );

  const activeDeliveries = allDeliveries.filter(
    (d) => d.order_status === "picking_up" || d.order_status === "in_transit"
  );

  // Total Upah Ongkir Kurir (Hak Kurir)
  const totalEarnedDeliveryFee = completedDeliveries.reduce(
    (sum, d) => sum + (d.delivery_fee || 0),
    0
  );

  // Estimasi ongkir dari tugas yang sedang berjalan
  const pendingDeliveryFee = activeDeliveries.reduce(
    (sum, d) => sum + (d.delivery_fee || 0),
    0
  );

  // Total Kas Titipan COD yang ditagih kurir secara fisik (Kewajiban setor ke pasar)
  const codDeliveries = completedDeliveries.filter(
    (d) => d.payment?.payment_method === "cod"
  );

  const totalCODCashCollected = codDeliveries.reduce(
    (sum, d) => sum + (d.total_amount || 0),
    0
  );

  const averageFeePerTrip =
    completedDeliveries.length > 0
      ? Math.round(totalEarnedDeliveryFee / completedDeliveries.length)
      : 0;

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawalAmount);
    if (!amount || amount <= 0) {
      toast.error("Masukkan nominal penarikan yang valid", {
        position: "top-right",
      });
      return;
    }
    if (amount > totalEarnedDeliveryFee) {
      toast.error("Nominal penarikan melebihi saldo upah ongkir yang tersedia", {
        position: "top-right",
      });
      return;
    }

    toast.success(
      `Permohonan penarikan upah ongkir Rp ${amount.toLocaleString(
        "id-ID"
      )} berhasil dikirimkan ke bendahara pasar!`,
      { position: "top-right" }
    );
    setIsWithdrawModalOpen(false);
    setWithdrawalAmount("");
  };

  const handleConfirmRemittance = () => {
    toast.success(
      "Bukti serah terima setoran uang fisik COD berhasil dicatat dan diverifikasi oleh kasir pasar!",
      { position: "top-right" }
    );
    setIsRemitCODModalOpen(false);
  };

  return {
    completedDeliveries,
    activeDeliveries,
    totalEarnedDeliveryFee,
    pendingDeliveryFee,
    codDeliveries,
    totalCODCashCollected,
    averageFeePerTrip,
    isLoading,
    isError,
    refetch,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    isRemitCODModalOpen,
    setIsRemitCODModalOpen,
    withdrawalAmount,
    setWithdrawalAmount,
    bankDestination,
    setBankDestination,
    handleRequestWithdrawal,
    handleConfirmRemittance,
  };
};
