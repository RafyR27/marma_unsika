"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import promo from "@/services/promo.service";

export interface IPromoItem {
  id: string | number;
  code: string;
  title: string;
  discountType: "percent" | "fixed" | "free_shipping";
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  quota: number;
  used: number;
  expiresAt: string;
  isActive: boolean;
}

export const initialPromos: IPromoItem[] = [];

export const useAdminPromos = () => {
  const [localPromos, setLocalPromos] = useState<IPromoItem[]>(initialPromos);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed" | "free_shipping">("free_shipping");
  const [discountValue, setDiscountValue] = useState<number>(20000);
  const [minSpend, setMinSpend] = useState<number>(50000);
  const [quota, setQuota] = useState<number>(50);
  const [expiresAt, setExpiresAt] = useState("2026-12-31");

  const { data: remotePromos, refetch } = useQuery({
    queryKey: ["admin", "promos"],
    queryFn: async () => {
      const res = await promo.getPromos();
      return res.data?.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const promos: IPromoItem[] =
    remotePromos && remotePromos.length > 0
      ? remotePromos.map((p) => ({
          id: p.id,
          code: p.code,
          title: p.title,
          discountType: p.discount_type,
          discountValue: p.discount_value,
          minSpend: p.min_spend,
          maxDiscount: p.max_discount ?? undefined,
          quota: p.quota,
          used: p.used,
          expiresAt: p.expires_at,
          isActive: p.is_active,
        }))
      : localPromos;

  const togglePromoStatus = async (id: string | number) => {
    try {
      const current = promos.find((p) => p.id === id);
      const nextStatus = !current?.isActive;
      await promo.togglePromoStatus(id, nextStatus);
      refetch();
    } catch {
      toast.info(
        "Modul status voucher sedang dalam tahap integrasi backend.",
        { position: "top-right" }
      );
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) {
      toast.error("Kode voucher dan judul wajib diisi", { position: "top-right" });
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_spend: Number(minSpend),
      quota: Number(quota),
      expires_at: expiresAt,
      is_active: true,
    };

    try {
      await promo.createPromo(payload);
      refetch();
      toast.success(`Voucher subsidi ${payload.code} berhasil diterbitkan!`, {
        position: "top-right",
      });
      setIsCreateModalOpen(false);
    } catch {
      toast.info(
        "Penerbitan voucher online sedang menunggu ketersediaan endpoint backend.",
        { position: "top-right" }
      );
      setIsCreateModalOpen(false);
    }
  };

  return {
    promos,
    isCreateModalOpen,
    setIsCreateModalOpen,
    code,
    setCode,
    title,
    setTitle,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    minSpend,
    setMinSpend,
    quota,
    setQuota,
    expiresAt,
    setExpiresAt,
    togglePromoStatus,
    handleCreatePromo,
  };
};
