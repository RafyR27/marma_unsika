"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import order from "@/services/order.service";
import payment from "@/services/payment.service";
import { PaymentMethod } from "@/types/payment";

export const usePayment = (orderNumber: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [externalReferenceId, setExternalReferenceId] = useState("");

  const {
    data: orderResponse,
    isLoading: isOrderLoading,
    isError: isOrderError,
    refetch: refetchOrder,
  } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const res = await order.getOrderByNumber(orderNumber);
      return res.data;
    },
    enabled: !!orderNumber,
  });

  const currentOrder = orderResponse?.data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file gambar maksimal 2 MB", { position: "top-right" });
      return;
    }

    setProofFile(file);
    const url = URL.createObjectURL(file);
    setProofPreview(url);
  };

  const { mutate: executePayment, isPending: isSubmitting } = useMutation({
    mutationFn: async () => {
      if (paymentMethod === "manual_transfer" && !proofFile) {
        throw new Error("Silakan unggah foto bukti transfer terlebih dahulu.");
      }

      const formData = new FormData();
      formData.append("payment_method", paymentMethod);

      if (paymentMethod === "manual_transfer") {
        if (proofFile) {
          formData.append("payment_proof", proofFile);
        }
        if (externalReferenceId) {
          formData.append("external_reference_id", externalReferenceId);
        }
      }

      const response = await payment.submitPayment(orderNumber, formData);
      return response.data;
    },
    onSuccess: () => {
      toast.success(
        paymentMethod === "cod"
          ? "Pesanan COD berhasil dikonfirmasi! Pedagang sedang menyiapkan barang."
          : "Bukti transfer berhasil dikirim. Menunggu verifikasi tim operasional.",
        { position: "top-right" }
      );
      queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/user/orders/${orderNumber}`);
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal memproses pembayaran";
      toast.error(msg, { position: "top-right" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executePayment();
  };

  return {
    orderNumber,
    currentOrder,
    isOrderLoading,
    isOrderError,
    refetchOrder,
    paymentMethod,
    setPaymentMethod,
    proofFile,
    proofPreview,
    handleFileChange,
    externalReferenceId,
    setExternalReferenceId,
    isSubmitting,
    handleSubmit,
  };
};
