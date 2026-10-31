"use client";

import { useState } from "react";
import { toast } from "sonner";

export interface IPromoItem {
  id: string;
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

export const initialPromos: IPromoItem[] = [
  {
    id: "PROMO-01",
    code: "SUBSIDI-ONGKIR-UNSIKA",
    title: "Subsidi Bebas Ongkir Pengantaran Pasar",
    discountType: "free_shipping",
    discountValue: 20000,
    minSpend: 50000,
    quota: 100,
    used: 34,
    expiresAt: "2026-11-30",
    isActive: true,
  },
  {
    id: "PROMO-02",
    code: "KULAKAN-CABAI-10K",
    title: "Potongan Harga Pembelian Cabai & Bawang",
    discountType: "fixed",
    discountValue: 10000,
    minSpend: 100000,
    quota: 50,
    used: 12,
    expiresAt: "2026-11-15",
    isActive: true,
  },
  {
    id: "PROMO-03",
    code: "WARUNG-BARU-5P",
    title: "Diskon 5% Pendaftaran Warung Baru",
    discountType: "percent",
    discountValue: 5,
    minSpend: 200000,
    maxDiscount: 25000,
    quota: 30,
    used: 18,
    expiresAt: "2026-12-31",
    isActive: true,
  },
];

export const useAdminPromos = () => {
  const [promos, setPromos] = useState<IPromoItem[]>(initialPromos);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed" | "free_shipping">("free_shipping");
  const [discountValue, setDiscountValue] = useState<number>(20000);
  const [minSpend, setMinSpend] = useState<number>(50000);
  const [quota, setQuota] = useState<number>(50);
  const [expiresAt, setExpiresAt] = useState("2026-12-31");

  const togglePromoStatus = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = !p.isActive;
          toast.success(
            next
              ? `Voucher ${p.code} diaktifkan kembali.`
              : `Voucher ${p.code} dinonaktifkan.`,
            { position: "top-right" }
          );
          return { ...p, isActive: next };
        }
        return p;
      })
    );
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) {
      toast.error("Kode voucher dan judul wajib diisi", { position: "top-right" });
      return;
    }

    const newPromo: IPromoItem = {
      id: `PROMO-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title: title.trim(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      quota: Number(quota),
      used: 0,
      expiresAt,
      isActive: true,
    };

    setPromos((prev) => [newPromo, ...prev]);
    toast.success(`Voucher subsidi ${newPromo.code} berhasil diterbitkan!`, {
      position: "top-right",
    });
    setIsCreateModalOpen(false);
    setCode("");
    setTitle("");
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
