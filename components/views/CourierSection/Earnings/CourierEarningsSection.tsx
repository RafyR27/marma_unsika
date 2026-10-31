"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet,
  Truck,
  Banknote,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  MapPin,
  Building2,
  Receipt,
  User,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useCourierEarnings } from "./useCourierEarnings";
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

export default function CourierEarningsSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
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
  } = useCourierEarnings();

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

  const isCourier = user?.role === "courier" || user?.role === "admin";
  if (!isCourier) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Kurir Lapangan</h2>
        <p className="text-sm text-muted-foreground">
          Halaman rekap upah ongkir dan kas COD ini hanya dapat diakses oleh kurir resmi pasar.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Kurir
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
            <Wallet className="w-6 h-6 text-primary" />
            Pendapatan Ongkir & Kas Titipan COD
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Rekap upah hasil pengantaran komoditas dan pencatatan uang tunai COD yang harus disetor.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>

          {totalCODCashCollected > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRemitCODModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-amber-600 border-amber-500/40 hover:bg-amber-500/10"
            >
              <Banknote className="w-4 h-4" />
              Setor Kas COD ({codDeliveries.length})
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => setIsWithdrawModalOpen(true)}
            disabled={totalEarnedDeliveryFee <= 0}
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <Wallet className="w-4 h-4" />
            Tarik Upah Ongkir
          </Button>
        </div>
      </div>

      {/* 4 Kartu Metrik Kurir */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Total Upah Ongkir Bersih */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-primary/40 ring-1 ring-primary/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Upah Ongkir Siap Tarik</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-extrabold text-primary">
            Rp {totalEarnedDeliveryFee.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Hak kurir dari {completedDeliveries.length} trip selesai
          </span>
        </div>

        {/* Metrik 2: Kas Titipan COD */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-amber-600">Uang Tunai COD Dipegang</span>
            <Banknote className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">
            Rp {totalCODCashCollected.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Wajib disetorkan ke kasir pasar
          </span>
        </div>

        {/* Metrik 3: Pengantaran Tuntas */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total Trip Selesai</span>
            <Truck className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {completedDeliveries.length} Trip
          </p>
          <span className="text-[11px] text-muted-foreground block">
            {activeDeliveries.length} trip sedang berjalan
          </span>
        </div>

        {/* Metrik 4: Rata-rata Upah per Trip */}
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Rata-rata per Trip</span>
            <Receipt className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            Rp {averageFeePerTrip.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Estimasi pendapatan per antaran
          </span>
        </div>
      </div>

      {/* Konten Terbagi 2 Kolom */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Kolom 1: Rekap Titipan Uang Tunai COD */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-base">Buku Kas Titipan COD</h2>
            </div>
            <span className="text-xs text-amber-600 font-semibold">
              {codDeliveries.length} Pesanan Tunai
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Daftar uang fisik yang Anda terima langsung dari pembeli warung untuk diteruskan ke kasir pasar induk.
          </p>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-6 border border-destructive/20 rounded-xl text-center space-y-2 bg-destructive/5 text-xs text-destructive">
              <AlertCircle className="w-6 h-6 mx-auto" />
              <p>Gagal memuat catatan kas COD.</p>
            </div>
          ) : codDeliveries.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Tidak ada uang tunai COD yang sedang dipegang saat ini.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {codDeliveries.map((delivery) => {
                const buyerProfile = delivery.buyer?.profile;
                const buyerName =
                  buyerProfile?.store_name || delivery.buyer?.name || "Warung Pembeli";

                return (
                  <div
                    key={delivery.id}
                    className="py-3 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">
                          #{delivery.order_number}
                        </span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-700 px-2 py-0.2 rounded font-semibold">
                          Uang Diterima
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate">
                        Dari Warung: {buyerName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Waktu:{" "}
                        {delivery.completed_at
                          ? new Date(delivery.completed_at).toLocaleString("id-ID", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "-"}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground block">
                        Uang Tunai:
                      </span>
                      <span className="font-bold text-sm text-amber-600">
                        {delivery.formatted_total_amount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Kolom 2: Riwayat Perjalanan Pengantaran Selesai */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Riwayat Perolehan Ongkir</h2>
            </div>
            <Link
              href="/courier/history"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Semua Riwayat
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : completedDeliveries.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Belum ada trip pengantaran yang diselesaikan.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {completedDeliveries.slice(0, 5).map((delivery) => {
                const address = delivery.delivery_address_snapshot;
                const buyerName =
                  address?.store_name || delivery.buyer?.name || "Warung Pembeli";

                return (
                  <div
                    key={delivery.id}
                    className="py-3 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">
                          #{delivery.order_number}
                        </span>
                        <span className="text-[10px] bg-green-500/10 text-green-700 px-2 py-0.2 rounded font-semibold">
                          Tuntas
                        </span>
                      </div>
                      <p className="text-muted-foreground truncate">
                        Tujuan: {buyerName}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {address?.full_address || "Alamat tercatat"}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-muted-foreground block">
                        Upah Ongkir:
                      </span>
                      <span className="font-bold text-sm text-primary">
                        + {delivery.formatted_delivery_fee}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: PENARIKAN UPAH ONGKIR */}
      <Dialog open={isWithdrawModalOpen} onOpenChange={setIsWithdrawModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Tarik Upah Ongkos Kirim Kurir
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pencairan saldo upah resmi hasil pengantaran komoditas pasar ke rekening kurir.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRequestWithdrawal} className="space-y-4 py-2 text-xs">
            <div className="p-3.5 rounded-lg border bg-muted/40 flex items-center justify-between">
              <div>
                <span className="text-muted-foreground block">Saldo Upah Siap Tarik:</span>
                <span className="font-bold text-base text-primary">
                  Rp {totalEarnedDeliveryFee.toLocaleString("id-ID")}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setWithdrawalAmount(String(totalEarnedDeliveryFee))}
                className="text-xs"
              >
                Tarik Semua
              </Button>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Nominal Penarikan (Rp):
              </label>
              <Input
                type="number"
                min="10000"
                max={totalEarnedDeliveryFee}
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Contoh: 100000"
                className="h-10 text-sm font-bold"
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Minimal penarikan Rp 10.000. Langsung diproses tanpa potongan admin.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                Rekening / E-Wallet Tujuan:
              </label>
              <select
                value={bankDestination}
                onChange={(e) => setBankDestination(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-xs outline-none focus:border-ring cursor-pointer"
              >
                <option value="BCA - Rekening Kurir">
                  BCA · Rekening Kurir ({user?.name})
                </option>
                <option value="DANA / GoPay">
                  E-Wallet (Nomor HP: {user?.phone})
                </option>
                <option value="Tunai Kasir Pasar">
                  Ambil Tunai di Pos Keuangan Armada Pasar
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
                Ajukan Pencairan Upah
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: KONFIRMASI SETOR UANG FISIK COD */}
      <Dialog open={isRemitCODModalOpen} onOpenChange={setIsRemitCODModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2 text-amber-600">
              <Banknote className="w-5 h-5" />
              Setor Uang Fisik Kas COD ke Pasar
            </DialogTitle>
            <DialogDescription className="text-xs">
              Konfirmasikan penyerahan uang tunai fisik yang telah Anda kumpulkan dari pembeli warung ke bendahara pasar induk.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
              <span className="text-muted-foreground block font-medium">
                Total Uang Fisik yang Wajib Disetor:
              </span>
              <p className="text-2xl font-extrabold text-amber-600">
                Rp {totalCODCashCollected.toLocaleString("id-ID")}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Berasal dari {codDeliveries.length} pesanan dengan metode pembayaran Cash on Delivery.
              </p>
            </div>

            <div className="space-y-1 text-muted-foreground text-[11px]">
              <p>1. Serahkan uang fisik langsung ke loket kasir Pasar Induk Makar.</p>
              <p>2. Minta paraf tanda terima fisik dari staf bendahara operasional.</p>
              <p>3. Klik tombol di bawah untuk mencatat pelaporan setoran kas COD.</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRemitCODModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmRemittance}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
            >
              Konfirmasi Uang Telah Disetor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
