"use client";

import { useRouter } from "next/navigation";
import {
  History,
  PackageCheck,
  Truck,
  MapPin,
  Banknote,
  ShieldAlert,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useCourierHistory } from "./useCourierHistory";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourierHistorySection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const {
    completedDeliveries,
    meta,
    page,
    setPage,
    totalEarnings,
    isLoading,
    isError,
    refetch,
  } = useCourierHistory();

  if (isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const isCourier = user?.role === "courier" || user?.role === "admin";
  if (!isCourier) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Kurir Lapangan</h2>
        <p className="text-sm text-muted-foreground">
          Halaman riwayat pengantaran ini hanya dapat diakses oleh kurir resmi pasar yang terdaftar.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Ke Beranda
          </Button>
          <Button onClick={() => router.push("/auth/login")}>
            Masuk sebagai Kurir
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Riwayat Pengantaran Kurir
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Daftar pesanan pasar yang telah berhasil diserahterimakan ke warung pembeli.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* Banner Ringkasan Pendapatan Halaman Ini */}
      <div className="p-4 rounded-xl border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-xs text-muted-foreground block">
            Total Pengantaran Tuntas di Halaman Ini:
          </span>
          <span className="text-lg font-bold text-foreground">
            {completedDeliveries.length} Pengiriman Selesai
          </span>
        </div>
        <div className="sm:text-right">
          <span className="text-xs text-muted-foreground block">
            Akumulasi Ongkir Kurir:
          </span>
          <span className="text-xl font-extrabold text-primary">
            Rp {totalEarnings.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      {/* Daftar Pengantaran Selesai */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil riwayat pengantaran dari server.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : completedDeliveries.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <PackageCheck className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Belum Ada Riwayat Pengantaran</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Selesaikan pengiriman aktif Anda untuk melihat catatan performa dan akumulasi upah ongkos kirim.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedDeliveries.map((delivery) => {
            const address = delivery.delivery_address_snapshot;
            const buyerProfile = delivery.buyer?.profile;
            const isCOD = delivery.payment?.payment_method === "cod";

            return (
              <div
                key={delivery.id}
                className="p-5 border rounded-xl bg-card shadow-xs hover:border-primary/40 transition-colors space-y-3"
              >
                {/* Header Kartu */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground">
                      #{delivery.order_number}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      Selesai:{" "}
                      {delivery.completed_at
                        ? new Date(delivery.completed_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400">
                      Tuntas Diserahkan
                    </span>
                    <span className="font-bold text-sm text-primary">
                      + {delivery.formatted_delivery_fee}
                    </span>
                  </div>
                </div>

                {/* Info Rute & Penerima */}
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Tujuan Warung Pembeli:</span>
                    <p className="font-semibold text-foreground">
                      {address?.recipient_name || delivery.buyer?.name} (
                      {address?.store_name || buyerProfile?.store_name || "Warung"}
                      )
                    </p>
                    <p className="text-muted-foreground truncate">
                      {address?.full_address || "Alamat tidak tercatat"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground block">Metode Transaksi:</span>
                    <p className="font-semibold text-foreground">
                      {isCOD ? "COD Tunai (Lunas ke Kurir)" : "Transfer Bank (Lunas)"}
                    </p>
                    <p className="text-muted-foreground">
                      Total Pesanan: {delivery.formatted_total_amount}
                    </p>
                  </div>
                </div>

                {/* Komoditas yang Diantar */}
                <div className="border-t pt-2 text-xs text-muted-foreground flex items-center justify-between">
                  <span>
                    Muatan: {delivery.items?.length || 0} jenis komoditas pasar
                  </span>
                  <span className="font-medium text-foreground">
                    Subtotal Barang: {delivery.formatted_subtotal_products}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Paginasi Riwayat */}
          {meta && meta.last_page > 1 && (
            <div className="p-3 border rounded-xl flex items-center justify-between text-xs text-muted-foreground bg-card">
              <span>
                Halaman {meta.current_page} dari {meta.last_page} (Total: {meta.total} pengantaran)
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
