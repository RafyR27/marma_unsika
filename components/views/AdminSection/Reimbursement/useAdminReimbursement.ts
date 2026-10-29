"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import admin from "@/services/admin.service";
import { toast } from "sonner";

export interface IDisbursementItem {
  id: string;
  recipientName: string;
  role: "seller" | "courier";
  storeName?: string;
  bankAccount: string;
  amount: number;
  orderReference: string;
  date: string;
  status: "pending" | "settled";
}

export const useAdminReimbursement = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "settled">("pending");
  const [selectedDisbursement, setSelectedDisbursement] = useState<IDisbursementItem | null>(null);

  // Ambil order yang sudah selesai untuk menghitung hak pedagang dan kurir
  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin", "reimbursement-orders"],
    queryFn: async () => {
      const res = await admin.getOrders({ order_status: "completed", per_page: 50 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const orders = ordersResponse?.data || [];

  // Generate daftar pencairan dari order selesai
  const disbursements: IDisbursementItem[] = [];

  orders.forEach((o) => {
    // Hak seller
    o.items?.forEach((item) => {
      const sellerProfile = item.seller?.profile;
      disbursements.push({
        id: `DISB-SEL-${item.id}`,
        recipientName: item.seller?.name || "Pedagang Kios",
        role: "seller",
        storeName: sellerProfile?.store_name || "Kios Pasar",
        bankAccount: "BCA · 8720-192-837",
        amount: item.subtotal,
        orderReference: `#${o.order_number} (${item.product_name_snapshot})`,
        date: o.completed_at || o.ordered_at || "",
        status: o.payment_status === "paid" ? "settled" : "pending",
      });
    });

    // Hak kurir
    if (o.courier) {
      disbursements.push({
        id: `DISB-CUR-${o.id}`,
        recipientName: o.courier.name,
        role: "courier",
        bankAccount: `E-Wallet (${o.courier.phone})`,
        amount: o.delivery_fee,
        orderReference: `#${o.order_number} (Ongkos Kirim)`,
        date: o.completed_at || o.ordered_at || "",
        status: "settled",
      });
    }
  });

  const pendingList = disbursements.filter((d) => d.status === "pending");
  const settledList = disbursements.filter((d) => d.status === "settled");

  const totalSettledAmount = settledList.reduce((sum, d) => sum + d.amount, 0);
  const totalPendingAmount = pendingList.reduce((sum, d) => sum + d.amount, 0);

  const handleApproveDisbursement = () => {
    if (!selectedDisbursement) return;
    toast.success(
      `Pencairan dana ${selectedDisbursement.id} sebesar Rp ${selectedDisbursement.amount.toLocaleString(
        "id-ID"
      )} berhasil dibukukan dan disetujui!`,
      { position: "top-right" }
    );
    setSelectedDisbursement(null);
  };

  return {
    activeTab,
    setActiveTab,
    pendingList,
    settledList,
    currentList: activeTab === "pending" ? pendingList : settledList,
    totalSettledAmount,
    totalPendingAmount,
    isLoading,
    isError,
    refetch,
    selectedDisbursement,
    setSelectedDisbursement,
    handleApproveDisbursement,
  };
};
