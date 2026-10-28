"use client";

import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Search,
  Truck,
  UserCheck,
  Ban,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Store,
  User,
  MapPin,
  Clock,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminOrders } from "./useAdminOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminOrdersSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();

  const {
    orders,
    meta,
    couriers,
    statusFilter,
    setStatusFilter,
    unassignedOnly,
    setUnassignedOnly,
    search,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    page,
    setPage,
    isOrdersLoading,
    isOrdersError,
    refetchOrders,
    assigningOrder,
    setAssigningOrder,
    selectedCourierId,
    setSelectedCourierId,
    executeAssignCourier,
    isAssigning,
    cancellingOrder,
    setCancellingOrder,
    cancelReason,
    setCancelReason,
    executeCancelOrder,
    isCancelling,
  } = useAdminOrders();

  if (isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
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
          Audit seluruh transaksi pasar hanya dapat diakses oleh tim pengelola pasar resmi.
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
            <ShoppingCart className="w-6 h-6 text-primary" />
            Audit Transaksi Pasar & Dispatching
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pantau pergerakan transaksi seluruh kios pasar induk, tugaskan kurir darurat, dan batalkan pesanan bermasalah.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchOrders()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 border rounded-xl bg-card">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari no. pesanan, nama pemesan, no. telp..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="text-xs">
            Cari
          </Button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Checkbox Belum Ada Kurir */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg bg-background text-xs cursor-pointer hover:border-primary">
            <input
              type="checkbox"
              checked={unassignedOnly}
              onChange={(e) => setUnassignedOnly(e.target.checked)}
              className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
            />
            <span className="font-semibold text-foreground">Butuh Kurir</span>
          </label>

          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background text-xs outline-none focus:border-ring cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="picking_up">Kurir Menjemput</option>
            <option value="in_transit">Dalam Pengantaran</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Pesanan */}
      {isOrdersLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isOrdersError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal memuat data transaksi pasar.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetchOrders()}>
            Coba Lagi
          </Button>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <ShoppingCart className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Tidak Ada Transaksi Ditemukan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search || unassignedOnly || statusFilter !== "all"
              ? "Tidak ada pesanan yang sesuai dengan filter pencarian Anda."
              : "Belum ada transaksi pesanan yang tercatat di sistem pasar."}
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground border-b text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Pesanan & Waktu</th>
                  <th className="py-3.5 px-4">Pembeli Warung</th>
                  <th className="py-3.5 px-4">Kurir Pengantar</th>
                  <th className="py-3.5 px-4">Total Nilai</th>
                  <th className="py-3.5 px-4">Status Pesanan</th>
                  <th className="py-3.5 px-4">Pembayaran</th>
                  <th className="py-3.5 px-4 text-right">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {orders.map((o) => {
                  const buyer = o.buyer;
                  const courier = o.courier;
                  const isCancelled = o.order_status === "cancelled";
                  const isCompleted = o.order_status === "completed";

                  return (
                    <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                      {/* Nomor Order & Tanggal */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-foreground block">
                          #{o.order_number}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {o.ordered_at
                            ? new Date(o.ordered_at).toLocaleString("id-ID", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "-"}
                        </span>
                      </td>

                      {/* Pembeli */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground block">
                          {buyer?.name || "Pembeli"}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {buyer?.phone}
                        </span>
                      </td>

                      {/* Kurir */}
                      <td className="py-3.5 px-4">
                        {courier ? (
                          <span className="font-medium text-foreground flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                            {courier.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            Belum Ada Kurir
                          </span>
                        )}
                      </td>

                      {/* Total Nilai */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-foreground block">
                          {o.formatted_total_amount}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Ongkir: {o.formatted_delivery_fee}
                        </span>
                      </td>

                      {/* Status Order */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                            isCompleted
                              ? "bg-green-500/10 text-green-700"
                              : isCancelled
                              ? "bg-destructive/10 text-destructive"
                              : o.order_status === "in_transit"
                              ? "bg-blue-500/10 text-blue-700"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {o.order_status === "pending"
                            ? "Menunggu"
                            : o.order_status === "confirmed"
                            ? "Dikonfirmasi"
                            : o.order_status === "picking_up"
                            ? "Menjemput"
                            : o.order_status === "in_transit"
                            ? "Diantar"
                            : o.order_status === "completed"
                            ? "Selesai"
                            : "Batal"}
                        </span>
                      </td>

                      {/* Pembayaran */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                            o.payment_status === "paid"
                              ? "bg-green-500/10 text-green-700"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {o.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
                        </span>
                      </td>

                      {/* Aksi Operasional */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tombol Assign Kurir jika belum selesai dan belum batal */}
                          {!isCompleted && !isCancelled && (
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                setAssigningOrder(o);
                                setSelectedCourierId(o.courier_id || "");
                              }}
                              className="text-xs"
                              title="Tugaskan Kurir"
                            >
                              <UserCheck className="w-3.5 h-3.5 mr-1" />
                              Kurir
                            </Button>
                          )}

                          {/* Tombol Batal Darurat Pasar */}
                          {!isCancelled && (
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => setCancellingOrder(o)}
                              className="text-destructive hover:bg-destructive/10 text-xs"
                              title="Batal Darurat"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginasi Audit */}
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

      {/* MODAL 1: TUGASKAN KURIR SECARA MANUAL */}
      <Dialog
        open={!!assigningOrder}
        onOpenChange={(open) => !open && setAssigningOrder(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Tugaskan Kurir Pesanan #{assigningOrder?.order_number}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pilih kurir lapangan yang bertugas menjemput barang di blok pasar induk dan mengantar ke warung pembeli.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 border rounded-lg bg-muted/40 space-y-1">
              <p className="font-semibold text-foreground">
                Tujuan Warung: {assigningOrder?.delivery_address_snapshot?.store_name || assigningOrder?.buyer?.name}
              </p>
              <p className="text-muted-foreground truncate">
                {assigningOrder?.delivery_address_snapshot?.full_address}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Pilih Kurir Lapangan:</label>
              <select
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(Number(e.target.value))}
                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-xs outline-none focus:border-ring cursor-pointer"
              >
                <option value="">Pilih kurir aktif...</option>
                {couriers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isAssigning}
              onClick={() => setAssigningOrder(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isAssigning || !selectedCourierId}
              onClick={() => {
                if (assigningOrder && selectedCourierId) {
                  executeAssignCourier({
                    orderNumber: assigningOrder.order_number,
                    courierId: Number(selectedCourierId),
                  });
                }
              }}
            >
              {isAssigning ? <Spinner className="mr-1" /> : "Tugaskan Kurir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: PEMBATALAN DARURAT PASAR OLEH ADMIN */}
      <Dialog
        open={!!cancellingOrder}
        onOpenChange={(open) => !open && setCancellingOrder(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2 text-destructive">
              <Ban className="w-5 h-5" />
              Batal Darurat Pesanan #{cancellingOrder?.order_number}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pembatalan darurat oleh admin akan secara otomatis mengembalikan stok seluruh komoditas ke etalase pedagang pasar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2 text-xs">
            <label className="font-semibold text-foreground">
              Alasan Pembatalan Darurat Pasar:
            </label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Contoh: Kios pasar tutup darurat, bencana cuaca, pembeli membatalkan via telepon operasional."
              rows={3}
              className="text-xs"
              disabled={isCancelling}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCancelling}
              onClick={() => setCancellingOrder(null)}
            >
              Kembali
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isCancelling || !cancelReason.trim()}
              onClick={() => {
                if (cancellingOrder) {
                  executeCancelOrder({
                    orderNumber: cancellingOrder.order_number,
                    reason: cancelReason,
                  });
                }
              }}
            >
              {isCancelling ? <Spinner className="mr-1" /> : "Eksekusi Pembatalan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
