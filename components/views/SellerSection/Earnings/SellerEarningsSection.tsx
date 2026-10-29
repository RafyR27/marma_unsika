"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  Store,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Package,
  CreditCard,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useSellerEarnings } from "./useSellerEarnings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SellerEarningsSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    completedOrders,
    inProgressOrders,
    totalSettledRevenue,
    totalPendingRevenue,
    codRevenue,
    transferRevenue,
    topSellingCommodities,
    isLoading,
    isError,
    refetch,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    withdrawalAmount,
    setWithdrawalAmount,
    bankDestination,
    setBankDestination,
    handleRequestWithdrawal,
  } = useSellerEarnings();

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

  const isSeller = user?.role === "seller" || user?.role === "admin";
  if (!isSeller) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Pedagang Pasar</h2>
        <p className="text-sm text-muted-foreground">
          Halaman rekap pendapatan keuangan ini hanya dapat diakses oleh mitra pedagang pasar yang terdaftar.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Seller
        </Button>
      </div>
    );
  }

  const profile = user?.profile;
  const storeName = profile?.store_name || user?.name || "Kios Pasar";

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            Rekap Pendapatan & Keuangan Kios
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Laporan omzet penjualan komoditas segar kios {storeName} dari pesanan warung pembeli.
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
            onClick={() => setIsWithdrawModalOpen(true)}
            disabled={totalSettledRevenue <= 0}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <Banknote className="w-4 h-4" />
            Tarik Dana Penjualan
          </Button>
        </div>
      </div>

      {/* 4 Kartu Metrik Keuangan Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Saldo Siap Tarik */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-primary/40 ring-1 ring-primary/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Saldo Siap Dicairkan</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-extrabold text-primary">
            Rp {totalSettledRevenue.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Dari {completedOrders.length} pesanan tuntas diserahkan
          </span>
        </div>

        {/* Metrik 2: Estimasi Berjalan */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Pendapatan Berjalan</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">
            Rp {totalPendingRevenue.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            {inProgressOrders.length} pesanan dalam proses kirim
          </span>
        </div>

        {/* Metrik 3: Omzet via Transfer Bank */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Omzet Transfer Bank</span>
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            Rp {transferRevenue.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Pembayaran transfer tervalidasi
          </span>
        </div>

        {/* Metrik 4: Omzet via Tunai COD */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Omzet Tunai COD</span>
            <Banknote className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            Rp {codRevenue.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Uang tunai disetor kurir pasar
          </span>
        </div>
      </div>

      {/* Konten Terbagi 2 Kolom */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Kolom 1: Komoditas Terlaris */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Komoditas Lapak Terlaris</h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Berdasarkan pesanan selesai
            </span>
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
              <p>Gagal memuat rekap penjualan komoditas.</p>
            </div>
          ) : topSellingCommodities.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Belum ada data penjualan komoditas yang tuntas.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {topSellingCommodities.map((item, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {item.name}
                    </p>
                    <p className="text-muted-foreground">
                      Terjual: <strong className="text-foreground">{item.totalQuantity} {item.unit}</strong> ({item.orderCount} transaksi)
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-muted-foreground block">
                      Kontribusi Omzet:
                    </span>
                    <span className="font-bold text-sm text-primary">
                      Rp {item.totalRevenue.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2: Faktur Penjualan Tuntas */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Faktur Penjualan Tuntas</h2>
            </div>
            <Link
              href="/seller/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Semua Pesanan
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : completedOrders.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Belum ada pesanan yang berstatus selesai diserahkan ke pembeli.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {completedOrders.slice(0, 5).map((order) => {
                const buyerProfile = order.buyer?.profile;
                const buyerName =
                  buyerProfile?.store_name || order.buyer?.name || "Warung Pembeli";
                const isCOD = order.payment?.payment_method === "cod";

                // Subtotal komoditas kios di order ini
                const stallSubtotal =
                  order.items?.reduce((sum, it) => sum + it.subtotal, 0) || 0;

                return (
                  <div
                    key={order.id}
                    className="py-3 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">
                          #{order.order_number}
                        </span>
                        <span className="text-[10px] bg-green-500/10 text-green-700 px-2 py-0.2 rounded font-semibold">
                          Selesai
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate">
                        Warung: {buyerName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Metode: {isCOD ? "COD Tunai" : "Transfer Bank Lunas"}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground block">
                        Hasil Lapak:
                      </span>
                      <span className="font-bold text-sm text-primary">
                        Rp {stallSubtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL PENARIKAN DANA PENJUALAN */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Banknote className="w-5 h-5 text-primary" />
              Tarik Saldo Hasil Penjualan Kios
            </DialogTitle>
            <DialogDescription className="text-xs">
              Dana yang dapat ditarik berasal dari pesanan komoditas yang telah diserahterimakan ke warung pembeli.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestWithdrawal} className="space-y-4 py-2 text-xs">
            {/* Info Saldo Tersedia */}
            <div className="p-3.5 rounded-lg border bg-muted/40 flex items-center justify-between">
              <div>
                <span className="text-muted-foreground block">Saldo Tersedia:</span>
                <span className="font-bold text-base text-primary">
                  Rp {totalSettledRevenue.toLocaleString("id-ID")}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setWithdrawalAmount(String(totalSettledRevenue))}
                className="text-xs"
              >
                Tarik Semua
              </Button>
            </div>

            {/* Input Nominal Penarikan */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Nominal Penarikan (Rp):
              </label>
              <Input
                type="number"
                min="10000"
                max={totalSettledRevenue}
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Contoh: 150000"
                className="h-10 text-sm font-bold"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Batas penarikan minimal Rp 10.000. Bebas biaya admin transfer bank.
              </p>
            </div>

            {/* Rekening Tujuan */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Rekening Bank Tujuan:
              </label>
              <select
                value={bankDestination}
                onChange={(e) => setBankDestination(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-xs outline-none focus:border-ring cursor-pointer"
              >
                <option value="BCA - Rekening Utama">
                  BCA · 8720-192-837 (a.n. Pemilik Kios)
                </option>
                <option value="Bank Mandiri">
                  Mandiri · 173-00-0982123-4 (a.n. Kios Berkah)
                </option>
                <option value="Tunai Bendahara Pasar">
                  Ambil Tunai di Kantor Bendahara Pasar Induk
                </option>
              </select>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsWithdrawModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Ajukan Pencairan Dana
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
