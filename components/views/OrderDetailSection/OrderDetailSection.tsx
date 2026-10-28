"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Store,
  Truck,
  CreditCard,
  AlertCircle,
  XCircle,
  PackageCheck,
  Ban,
  Clock,
  User,
} from "lucide-react";

import { useOrderDetail } from "./useOrderDetail";
import { Button } from "@/components/ui/button";
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

interface OrderDetailSectionProps {
  orderNumber: string;
}

const statusSteps = [
  { key: "pending", label: "Menunggu" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "picking_up", label: "Penjemputan Kios" },
  { key: "in_transit", label: "Dalam Pengiriman" },
  { key: "completed", label: "Selesai" },
];

export default function OrderDetailSection({ orderNumber }: OrderDetailSectionProps) {
  const {
    currentOrder,
    isLoading,
    isError,
    refetch,
    isCancelModalOpen,
    setIsCancelModalOpen,
    cancelReason,
    setCancelReason,
    isCancelling,
    executeCancel,
  } = useOrderDetail(orderNumber);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <div className="grid lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="lg:col-span-1 h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !currentOrder) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border rounded-xl text-center space-y-4 bg-card">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold">Pesanan Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground">
          Nomor pesanan &quot;{orderNumber}&quot; tidak terdaftar atau sesi login Anda telah berakhir.
        </p>
        <div className="flex justify-center gap-2 pt-2">
          <Button variant="outline" onClick={() => refetch()}>
            Coba Lagi
          </Button>
          <Button nativeButton={false} render={<Link href="/user/orders" />}>
            Daftar Pesanan
          </Button>
        </div>
      </div>
    );
  }

  const isCancelled = currentOrder.order_status === "cancelled";
  const isPending = currentOrder.order_status === "pending";
  const isUnpaid = currentOrder.payment_status === "unpaid";
  const address = currentOrder.delivery_address_snapshot;

  // Indeks stepper
  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === currentOrder.order_status
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header Navigasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link
            href="/user/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Daftar Semua Pesanan
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Pesanan #{orderNumber}</h1>
            {isCancelled ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                Dibatalkan
              </span>
            ) : currentOrder.order_status === "completed" ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20">
                Selesai
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Dalam Proses
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Dibuat pada:{" "}
            {currentOrder.ordered_at
              ? new Date(currentOrder.ordered_at).toLocaleString("id-ID", {
                  dateStyle: "long",
                  timeStyle: "short",
                })
              : "-"}
          </p>
        </div>

        {/* Tombol Aksi Cepat */}
        <div className="flex items-center gap-2">
          {isPending && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Ban className="w-4 h-4 mr-1.5" />
              Batalkan Pesanan
            </Button>
          )}

          {isUnpaid && !isCancelled && (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href={`/user/orders/${orderNumber}/payment`} />}
            >
              <CreditCard className="w-4 h-4 mr-1.5" />
              Bayar Sekarang
            </Button>
          )}
        </div>
      </div>

      {/* Timeline Stepper Status (jika tidak dibatalkan) */}
      {!isCancelled && (
        <div className="p-5 border rounded-xl bg-card mb-6 shadow-xs">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Progres Pengantaran Komoditas
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {statusSteps.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-lg border text-xs transition-colors ${
                    isCurrent
                      ? "border-primary bg-primary/10 font-bold text-primary ring-1 ring-primary/40"
                      : isPassed
                      ? "border-primary/40 bg-muted/40 font-medium text-foreground"
                      : "border-border text-muted-foreground/60"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[10px] opacity-70">
                      0{idx + 1}
                    </span>
                    {isPassed && <PackageCheck className="w-3.5 h-3.5 text-primary" />}
                  </div>
                  <p className="line-clamp-1">{step.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notifikasi jika Dibatalkan */}
      {isCancelled && (
        <div className="p-4 border rounded-xl bg-destructive/5 border-destructive/30 mb-6 flex items-start gap-3 text-sm">
          <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-destructive">Pesanan Telah Dibatalkan</p>
            <p className="text-xs text-muted-foreground">
              Alasan: {currentOrder.cancellation_reason || "Dibatalkan oleh pembeli."}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Kuantitas stok produk telah dikembalikan utuh ke etalase pedagang pasar.
            </p>
          </div>
        </div>
      )}

      {/* Grid Konten Detail */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Kolom Kiri: Rincian Barang & Pengiriman (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daftar Barang Dipesan */}
          <div className="p-5 border rounded-xl bg-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Komoditas dari Kios Pasar Induk
              </h2>
              <span className="text-xs text-muted-foreground font-medium">
                {currentOrder.items?.length || 0} Barang
              </span>
            </div>

            <div className="divide-y">
              {currentOrder.items?.map((item) => {
                const storeName =
                  item.seller?.profile?.store_name ||
                  item.seller?.name ||
                  "Kios Pasar";
                const blockNumber = item.seller?.profile?.block_number;
                const marketName = item.seller?.profile?.market_name;

                return (
                  <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted border">
                        <Image
                          src={item.product?.image_url || "/test.jpg"}
                          alt={item.product_name_snapshot}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {item.product_name_snapshot}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                          <span>{storeName}</span>
                          {marketName && <span>· {marketName}</span>}
                          {blockNumber && <span>({blockNumber})</span>}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {item.quantity} {item.unit_snapshot} x {item.formatted_price_at_purchase}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <p className="font-bold text-sm text-foreground">
                        {item.formatted_subtotal}
                      </p>
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.pickup_status === "picked_up"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : item.pickup_status === "out_of_stock"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.pickup_status === "picked_up"
                          ? "Sudah Diambil Kurir"
                          : item.pickup_status === "out_of_stock"
                          ? "Stok Kios Kosong"
                          : "Menunggu Pengambilan"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alamat Pengiriman */}
          <div className="p-5 border rounded-xl bg-card space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Tujuan Pengiriman</h2>
            </div>
            <div className="text-xs space-y-1">
              <p className="font-semibold text-sm text-foreground">
                {address?.recipient_name || currentOrder.buyer?.name}
              </p>
              <p className="text-muted-foreground">Telepon: {address?.phone || currentOrder.buyer?.phone}</p>
              {address?.store_name && (
                <p className="text-muted-foreground">Toko/Warung: {address.store_name}</p>
              )}
              <p className="text-foreground leading-relaxed pt-1">
                {address?.full_address || "Alamat belum diatur"}
              </p>
            </div>
          </div>

          {/* Catatan Tambahan (jika ada) */}
          {currentOrder.notes && (
            <div className="p-4 border rounded-xl bg-muted/30 space-y-1 text-xs">
              <span className="font-semibold text-foreground">Catatan Pesanan:</span>
              <p className="text-muted-foreground">{currentOrder.notes}</p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Status Pembayaran & Kurir (1 Col) */}
        <div className="lg:col-span-1 space-y-5">
          {/* Kartu Status Pembayaran */}
          <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="font-bold text-sm flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-primary" />
                Status Pembayaran
              </h2>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  currentOrder.payment_status === "paid"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {currentOrder.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Metode:</span>
                <span className="font-semibold text-foreground uppercase">
                  {currentOrder.payment?.payment_method === "cod"
                    ? "Cash on Delivery (COD)"
                    : currentOrder.payment?.payment_method === "manual_transfer"
                    ? "Transfer Bank Manual"
                    : "Belum Dipilih"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal Komoditas:</span>
                <span>{currentOrder.formatted_subtotal_products}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkir Pasar:</span>
                <span>{currentOrder.formatted_delivery_fee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-sm">
                <span>Total Tagihan:</span>
                <span className="text-primary">{currentOrder.formatted_total_amount}</span>
              </div>
            </div>

            {isUnpaid && !isCancelled && (
              <Button
                className="w-full text-xs font-semibold"
                nativeButton={false}
                render={<Link href={`/user/orders/${orderNumber}/payment`} />}
              >
                Pilih / Selesaikan Pembayaran
              </Button>
            )}
          </div>

          {/* Kartu Informasi Kurir Lapangan */}
          <div className="p-5 border rounded-xl bg-card space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Truck className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-sm">Kurir Pengantar</h2>
            </div>

            {currentOrder.courier ? (
              <div className="flex items-center gap-3 text-xs">
                <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{currentOrder.courier.name}</p>
                  <p className="text-muted-foreground">Telp: {currentOrder.courier.phone}</p>
                  <span className="inline-block mt-1 text-[10px] bg-green-500/10 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    Kurir Resmi Pasar Makar
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Menunggu penugasan kurir lapangan
                </p>
                <p className="text-[11px] leading-relaxed">
                  Kurir akan segera mengklaim pesanan ini setelah barang diverifikasi dan siap dijemput.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog Pembatalan Pesanan */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Ban className="w-5 h-5" />
              Batalkan Pesanan #{orderNumber}?
            </DialogTitle>
            <DialogDescription className="text-xs pt-1">
              Pesanan hanya dapat dibatalkan selama masih berstatus Menunggu. Seluruh stok komoditas akan dikembalikan ke kios pedagang.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold">Alasan Pembatalan (Opsional):</label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Contoh: Salah memilih komoditas, warung tutup darurat, dll."
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
              onClick={() => setIsCancelModalOpen(false)}
            >
              Kembali
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isCancelling}
              onClick={() => executeCancel()}
            >
              {isCancelling ? <Spinner className="mr-1" /> : "Ya, Batalkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
