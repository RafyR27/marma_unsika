"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Store,
  Truck,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  Building2,
  Check,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminReimbursement } from "./useAdminReimbursement";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminReimbursementSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    activeTab,
    setActiveTab,
    pendingList,
    settledList,
    currentList,
    totalSettledAmount,
    totalPendingAmount,
    isLoading,
    isError,
    refetch,
    selectedDisbursement,
    setSelectedDisbursement,
    handleApproveDisbursement,
  } = useAdminReimbursement();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
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
          Pengelolaan pencairan dana lapak kios dan upah kurir hanya dapat diakses oleh tim kasir dan bendahara pasar.
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
            <Banknote className="w-6 h-6 text-primary" />
            Pencairan Dana Pedagang & Kurir
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manajemen pencairan saldo omzet lapak pasar induk dan upah kurir lapangan yang telah selesai diantar.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Data
        </Button>
      </div>

      {/* 2 Kartu Metrik Pencairan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-green-500/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-green-700 dark:text-green-400">Total Dana Berhasil Dicairkan</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-extrabold text-green-600">
            Rp {totalSettledAmount.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            {settledList.length} pos pencairan lunas
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-amber-600">Antrean Siap Dicairkan</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">
            Rp {totalPendingAmount.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            {pendingList.length} permohonan dana menunggu persetujuan
          </span>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "pending"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Antrean Siap Cair ({pendingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settled")}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 ${
            activeTab === "settled"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Riwayat Pencairan Selesai ({settledList.length})</span>
        </button>
      </div>

      {/* Konten Tabel Pencairan */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil data pencairan dana pasar.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : currentList.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <Banknote className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Tidak Ada Pos Pencairan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {activeTab === "pending"
              ? "Semua permohonan pencairan telah selesai diproses oleh kasir pasar."
              : "Belum ada riwayat pencairan dana tercatat."}
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground border-b text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Penerima Dana</th>
                  <th className="py-3.5 px-4">Peran (Role)</th>
                  <th className="py-3.5 px-4">Nominal Pencairan</th>
                  <th className="py-3.5 px-4">Referensi Transaksi</th>
                  <th className="py-3.5 px-4">Rekening Tujuan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {currentList.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block">
                        {item.recipientName}
                      </span>
                      {item.storeName && (
                        <span className="text-[11px] text-muted-foreground">
                          {item.storeName}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1 ${
                          item.role === "seller"
                            ? "bg-emerald-500/10 text-emerald-700"
                            : "bg-blue-500/10 text-blue-700"
                        }`}
                      >
                        {item.role === "seller" ? (
                          <>
                            <Store className="w-3 h-3" />
                            Kios Pasar
                          </>
                        ) : (
                          <>
                            <Truck className="w-3 h-3" />
                            Kurir Lapangan
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-base text-primary">
                      Rp {item.amount.toLocaleString("id-ID")}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground truncate max-w-xs">
                      {item.orderReference}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {item.bankAccount}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {item.status === "pending" ? (
                        <Button
                          size="xs"
                          onClick={() => setSelectedDisbursement(item)}
                          className="text-xs font-semibold"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Setujui Cair
                        </Button>
                      ) : (
                        <span className="inline-flex items-center text-[11px] font-semibold text-green-700 bg-green-500/10 px-2 py-0.5 rounded-full">
                          Lunas Cair
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI PENCAIRAN KASIR */}
      <Dialog
        open={!!selectedDisbursement}
        onOpenChange={(open) => !open && setSelectedDisbursement(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Banknote className="w-5 h-5 text-primary" />
              Konfirmasi Pencairan Dana Pasar
            </DialogTitle>
            <DialogDescription className="text-xs">
              Persetujuan transfer dana hasil penjualan atau upah kurir ke pihak penerima.
            </DialogDescription>
          </DialogHeader>

          {selectedDisbursement && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3.5 rounded-xl border bg-muted/40 space-y-1">
                <span className="text-muted-foreground block">Penerima Dana:</span>
                <p className="font-bold text-sm text-foreground">
                  {selectedDisbursement.recipientName} ({selectedDisbursement.storeName || selectedDisbursement.role})
                </p>
                <p className="text-muted-foreground">
                  Rekening Tujuan: <strong className="text-foreground">{selectedDisbursement.bankAccount}</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-xl border bg-primary/5 space-y-1">
                <span className="text-muted-foreground block">Nominal Pencairan:</span>
                <p className="text-2xl font-extrabold text-primary">
                  Rp {selectedDisbursement.amount.toLocaleString("id-ID")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Referensi: {selectedDisbursement.orderReference}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedDisbursement(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApproveDisbursement}
              className="font-semibold"
            >
              Setujui & Transfer Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
