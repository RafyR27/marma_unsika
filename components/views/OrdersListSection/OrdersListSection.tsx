"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Store,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import { useOrdersList, OrderFilterTab } from "./useOrdersList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const tabs: { key: OrderFilterTab; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "in_progress", label: "Diproses / Dikirim" },
  { key: "completed", label: "Selesai" },
  { key: "cancelled", label: "Dibatalkan" },
];

export default function OrdersListSection() {
  const {
    orders,
    meta,
    activeTab,
    setActiveTab,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
  } = useOrdersList();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const hasToken =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  if (!hasToken) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border rounded-xl text-center space-y-4 bg-card">
        <Package className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold">Masuk untuk Melihat Pesanan</h2>
        <p className="text-sm text-muted-foreground">
          Silakan masuk ke akun warung Anda untuk memantau riwayat dan status pengiriman pesanan.
        </p>
        <Button nativeButton={false} render={<Link href="/auth/login" className="px-6" />}>
          Masuk Sekarang
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesanan Saya</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Pantau riwayat pembelian komoditas pasar, status pembayaran, dan pengantaran kurir.
        </p>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer shrink-0 border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Konten Daftar Pesanan */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil riwayat pesanan dari server.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Coba Lagi
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-4 bg-muted/20">
          <ShoppingBag className="w-14 h-14 text-muted-foreground/50 mx-auto" />
          <h2 className="text-base font-bold">Belum Ada Pesanan</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {activeTab === "all"
              ? "Anda belum pernah melakukan pemesanan komoditas. Mulai belanja kebutuhan warung Anda sekarang."
              : `Tidak ada pesanan dengan status tab "${tabs.find((t) => t.key === activeTab)?.label}".`}
          </p>
          {activeTab === "all" && (
            <Button nativeButton={false} render={<Link href="/" />}>
              Mulai Belanja
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const isUnpaid = o.payment_status === "unpaid";
            const isCancelled = o.order_status === "cancelled";
            const firstItem = o.items?.[0];
            const otherItemsCount = (o.items?.length || 1) - 1;

            return (
              <div
                key={o.id}
                className="border rounded-xl p-5 bg-card hover:border-primary/40 transition-colors shadow-xs space-y-4"
              >
                {/* Header Kartu Pesanan */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">
                      #{o.order_number}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {o.ordered_at
                        ? new Date(o.ordered_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Badge Status Pesanan */}
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full ${
                        isCancelled
                          ? "bg-destructive/10 text-destructive"
                          : o.order_status === "completed"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : o.order_status === "in_transit"
                          ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {o.order_status === "pending"
                        ? "Menunggu Konfirmasi"
                        : o.order_status === "confirmed"
                        ? "Dikonfirmasi"
                        : o.order_status === "picking_up"
                        ? "Kurir Menjemput"
                        : o.order_status === "in_transit"
                        ? "Sedang Diantar"
                        : o.order_status === "completed"
                        ? "Pesanan Selesai"
                        : "Dibatalkan"}
                    </span>

                    {/* Badge Status Pembayaran */}
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full ${
                        o.payment_status === "paid"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {o.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                    </span>
                  </div>
                </div>

                {/* Konten Barang Singkat */}
                {firstItem && (
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted border">
                      <Image
                        src={firstItem.product?.image_url || "/test.jpg"}
                        alt={firstItem.product_name_snapshot}
                        fill
                        sizes="56px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm truncate">
                        {firstItem.product_name_snapshot}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                        <Store className="w-3 h-3 shrink-0" />
                        <span>
                          {firstItem.seller?.profile?.store_name ||
                            firstItem.seller?.name ||
                            "Kios Pasar"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {firstItem.quantity} {firstItem.unit_snapshot} x {firstItem.formatted_price_at_purchase}
                        {otherItemsCount > 0 && (
                          <span className="font-medium text-primary ml-2">
                            +{otherItemsCount} komoditas lainnya
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Kartu & Aksi */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
                  <div className="text-xs">
                    <span className="text-muted-foreground block">Total Tagihan:</span>
                    <span className="font-bold text-base text-primary">
                      {o.formatted_total_amount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUnpaid && !isCancelled && (
                      <Button
                        size="sm"
                        variant="default"
                        nativeButton={false}
                        render={<Link href={`/user/orders/${o.order_number}/payment`} />}
                      >
                        <CreditCard className="w-3.5 h-3.5 mr-1" />
                        Bayar Sekarang
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      nativeButton={false}
                      render={<Link href={`/user/orders/${o.order_number}`} />}
                    >
                      Lihat Rincian
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Paginasi jika ada halaman selanjutnya */}
          {meta && meta.last_page > 1 && (
            <div className="p-3 border rounded-xl flex items-center justify-between text-xs text-muted-foreground bg-card">
              <span>
                Halaman {meta.current_page} dari {meta.last_page} (Total: {meta.total} pesanan)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={page <= 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={page >= meta.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
