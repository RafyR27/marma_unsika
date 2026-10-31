"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  Percent,
  Truck,
  Store,
  Package,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminReports } from "./useAdminReports";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReportsSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    totalOrders,
    completedOrdersCount,
    cancelledOrdersCount,
    inProgressOrdersCount,
    totalGMV,
    totalDeliveryFees,
    totalCommoditiesTurnover,
    averageOrderValue,
    successRate,
    topCommodities,
    topStalls,
    categoriesCount,
    isLoading,
    isError,
    refetch,
  } = useAdminReports();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Administrator</h2>
        <p className="text-sm text-muted-foreground">
          Pusat laporan performa dan analitik ekosistem pasar hanya dapat diakses oleh tim pengelola resmi.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Laporan Kinerja & Analitik Ekosistem Pasar
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Analisis volume perputaran barang grosir, efisiensi logistik kurir, dan komoditas unggulan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Laporan
          </Button>
        </div>
      </div>

      {/* 4 Kartu Indikator Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total GMV */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-primary/30 ring-1 ring-primary/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Total GMV (Omzet Pasar)</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-extrabold text-primary">
            Rp {totalGMV.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Nilai transaksi yang selesai
          </span>
        </div>

        {/* Metrik 2: Rata-rata Keranjang (AOV) */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Rata-rata Nilai Pesanan</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            Rp {averageOrderValue.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Per transaksi belanja warung
          </span>
        </div>

        {/* Metrik 3: Rasio Penyelesaian Pengantaran */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Tingkat Sukses Kirim</span>
            <Percent className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{successRate}%</p>
          <span className="text-[11px] text-muted-foreground block">
            {completedOrdersCount} dari {totalOrders} order selesai
          </span>
        </div>

        {/* Metrik 4: Total Perputaran Ongkir Kurir */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Perputaran Ongkir Kurir</span>
            <Truck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            Rp {totalDeliveryFees.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Didistribusikan ke armada kurir
          </span>
        </div>
      </div>

      {/* Ringkasan Status Distribusi Pesanan */}
      <div className="p-5 border rounded-xl bg-card shadow-xs space-y-3">
        <h2 className="font-bold text-sm text-foreground">
          Distribusi Status Seluruh Pesanan Pasar
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 rounded-lg border bg-green-500/5 border-green-500/20 space-y-1">
            <span className="text-muted-foreground block">Pesanan Tuntas Selesai</span>
            <p className="text-xl font-bold text-green-600">{completedOrdersCount}</p>
          </div>
          <div className="p-3 rounded-lg border bg-blue-500/5 border-blue-500/20 space-y-1">
            <span className="text-muted-foreground block">Sedang Berjalan / Kirim</span>
            <p className="text-xl font-bold text-blue-600">{inProgressOrdersCount}</p>
          </div>
          <div className="p-3 rounded-lg border bg-destructive/5 border-destructive/20 space-y-1">
            <span className="text-muted-foreground block">Pesanan Dibatalkan</span>
            <p className="text-xl font-bold text-destructive">{cancelledOrdersCount}</p>
          </div>
        </div>
      </div>

      {/* Konten Terbagi 2 Kolom */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Kolom 1: Komoditas Terlaris di Pasar */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Komoditas Pasar Terlaris</h2>
            </div>
            <span className="text-xs text-muted-foreground">Volume Grosir</span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-6 border border-destructive/20 rounded-xl text-center space-y-2 bg-destructive/5 text-xs text-destructive">
              <AlertCircle className="w-6 h-6 mx-auto" />
              <p>Gagal memuat analitik komoditas.</p>
            </div>
          ) : topCommodities.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Belum ada data penjualan komoditas yang selesai.
              </p>
            </div>
          ) : (
            <div className="divide-y text-xs">
              {topCommodities.map((c, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary font-mono">
                        #{idx + 1}
                      </span>
                      <p className="font-semibold text-sm text-foreground truncate">
                        {c.name}
                      </p>
                    </div>
                    <p className="text-muted-foreground pl-5">
                      Kuantitas: <strong className="text-foreground">{c.quantitySold} {c.unit}</strong>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-muted-foreground block">
                      Total Omzet:
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      Rp {c.revenue.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2: Performa Kios Lapak Paling Produktif */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Kios Lapak Paling Produktif</h2>
            </div>
            <span className="text-xs text-muted-foreground">Pasar Induk</span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : topStalls.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Belum ada data transaksi kios yang selesai.
              </p>
            </div>
          ) : (
            <div className="divide-y text-xs">
              {topStalls.map((s, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary font-mono">
                        #{idx + 1}
                      </span>
                      <p className="font-semibold text-sm text-foreground truncate">
                        {s.storeName}
                      </p>
                    </div>
                    <p className="text-muted-foreground pl-5">
                      {s.marketName} · {s.totalOrders} pesanan dipenuhi
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-muted-foreground block">
                      Kontribusi Penjualan:
                    </span>
                    <span className="font-bold text-sm text-primary">
                      Rp {s.totalRevenue.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
