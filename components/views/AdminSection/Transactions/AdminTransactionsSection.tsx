"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ReceiptText,
  Search,
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  Printer,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Store,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminTransactions } from "./useAdminTransactions";
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

export default function AdminTransactionsSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    transactions,
    meta,
    totalVolume,
    totalPaid,
    totalUnpaid,
    methodFilter,
    setMethodFilter,
    statusFilter,
    setStatusFilter,
    search,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    selectedReceiptOrder,
    setSelectedReceiptOrder,
  } = useAdminTransactions();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
          Pembukuan transaksi keuangan pasar hanya dapat diakses oleh tim pengelola resmi.
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
            <ReceiptText className="w-6 h-6 text-primary" />
            Buku Transaksi Keuangan Pasar
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Rekapitulasi seluruh transaksi tunai COD dan transfer bank resmi di platform Pasar Makar.
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

      {/* 3 Kartu Metrik Transaksi */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total Volume Transaksi</span>
            <ReceiptText className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-extrabold text-foreground">
            Rp {totalVolume.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Seluruh transaksi tercatat di halaman ini
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-green-500/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-green-700 dark:text-green-400">Kas Lunas Tervalidasi</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-extrabold text-green-600">
            Rp {totalPaid.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Dana masuk terkonfirmasi
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-amber-600">Transaksi Menunggu Lunas</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600">
            Rp {totalUnpaid.toLocaleString("id-ID")}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Belum transfer / COD berjalan
          </span>
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 border rounded-xl bg-card">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari nomor pesanan, nama pemesan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="text-xs">
            Cari
          </Button>
        </form>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Dropdown Metode Bayar */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background outline-none focus:border-ring cursor-pointer"
          >
            <option value="all">Semua Metode Pembayaran</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="manual_transfer">Transfer Bank Manual</option>
          </select>

          {/* Dropdown Status Lunas */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background outline-none focus:border-ring cursor-pointer"
          >
            <option value="all">Semua Status Pelunasan</option>
            <option value="paid">Lunas (Paid)</option>
            <option value="unpaid">Belum Lunas (Unpaid)</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Transaksi */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil data buku transaksi keuangan.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <ReceiptText className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Tidak Ada Transaksi Ditemukan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search || methodFilter !== "all" || statusFilter !== "all"
              ? "Tidak ada transaksi yang cocok dengan kriteria filter Anda."
              : "Belum ada transaksi tercatat di platform pasar."}
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground border-b text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Transaksi</th>
                  <th className="py-3.5 px-4">Tanggal & Jam</th>
                  <th className="py-3.5 px-4">Pihak Pembeli</th>
                  <th className="py-3.5 px-4">Metode Bayar</th>
                  <th className="py-3.5 px-4">Total Tagihan</th>
                  <th className="py-3.5 px-4">Status Pembayaran</th>
                  <th className="py-3.5 px-4 text-right">Faktur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {transactions.map((t) => {
                  const isPaid = t.payment_status === "paid";
                  const isCOD = t.payment?.payment_method === "cod";
                  const buyer = t.buyer;
                  const address = t.delivery_address_snapshot;

                  return (
                    <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                        #{t.order_number}
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground">
                        {t.ordered_at
                          ? new Date(t.ordered_at).toLocaleString("id-ID", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "-"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground block">
                          {address?.store_name || buyer?.name || "Warung"}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {buyer?.phone}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-medium">
                          {isCOD ? (
                            <>
                              <Banknote className="w-3.5 h-3.5 text-amber-500" />
                              COD Tunai
                            </>
                          ) : (
                            <>
                              <Building2 className="w-3.5 h-3.5 text-primary" />
                              Transfer Bank
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {t.formatted_total_amount}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold px-2.5 py-0.5 rounded-full text-[11px] ${
                            isPaid
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {isPaid ? "Lunas" : "Belum Lunas"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedReceiptOrder(t)}
                          className="text-xs"
                          title="Lihat Faktur"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Faktur
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginasi Transaksi */}
          {meta && meta.last_page > 1 && (
            <div className="p-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Halaman {meta.current_page} dari {meta.last_page} (Total: {meta.total} transaksi)
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

      {/* MODAL FAKTUR TRANSAKSI / SLIP RESMI */}
      <Dialog
        open={!!selectedReceiptOrder}
        onOpenChange={(open) => !open && setSelectedReceiptOrder(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-primary" />
              Faktur Transaksi #{selectedReceiptOrder?.order_number}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Bukti sah transaksi platform pasar grosir Marma UNSIKA.
            </DialogDescription>
          </DialogHeader>

          {selectedReceiptOrder && (
            <div className="space-y-4 py-2 text-xs divide-y">
              {/* Info Pembeli & Waktu */}
              <div className="space-y-1.5 pb-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Waktu Pemesanan:</span>
                  <span className="font-semibold text-foreground">
                    {selectedReceiptOrder.ordered_at
                      ? new Date(selectedReceiptOrder.ordered_at).toLocaleString("id-ID")
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pihak Pembeli:</span>
                  <span className="font-semibold text-foreground">
                    {selectedReceiptOrder.delivery_address_snapshot?.recipient_name || selectedReceiptOrder.buyer?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode Pembayaran:</span>
                  <span className="font-semibold text-foreground uppercase">
                    {selectedReceiptOrder.payment?.payment_method === "cod"
                      ? "Cash on Delivery"
                      : "Transfer Bank"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status Pelunasan:</span>
                  <span className="font-bold text-green-600">
                    {selectedReceiptOrder.payment_status === "paid"
                      ? "LUNAS"
                      : "BELUM LUNAS"}
                  </span>
                </div>
              </div>

              {/* Rincian Komoditas */}
              <div className="pt-2 space-y-1.5">
                <span className="font-semibold text-foreground block">
                  Rincian Komoditas Pasar:
                </span>
                {selectedReceiptOrder.items?.map((it) => (
                  <div key={it.id} className="flex justify-between text-muted-foreground">
                    <span>
                      {it.product_name_snapshot} ({it.quantity} {it.unit_snapshot})
                    </span>
                    <span className="font-semibold text-foreground">
                      {it.formatted_subtotal}
                    </span>
                  </div>
                ))}
              </div>

              {/* Rincian Finansial Akhir */}
              <div className="pt-2 space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal Komoditas:</span>
                  <span>{selectedReceiptOrder.formatted_subtotal_products}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Ongkos Kirim Pasar:</span>
                  <span>{selectedReceiptOrder.formatted_delivery_fee}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t">
                  <span>Total Faktur:</span>
                  <span className="text-primary">
                    {selectedReceiptOrder.formatted_total_amount}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedReceiptOrder(null)}
            >
              Tutup
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => window.print()}
              className="flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Faktur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
