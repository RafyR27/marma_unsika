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
  ExternalLink,
  Phone,
  CheckCircle2,
  Receipt,
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
  { key: "pending", label: "Menunggu", desc: "Pesanan masuk ke sistem" },
  { key: "confirmed", label: "Dikonfirmasi", desc: "Diverifikasi kios pasar" },
  { key: "picking_up", label: "Penjemputan", desc: "Kurir mengambil komoditas" },
  { key: "in_transit", label: "Dalam Pengantaran", desc: "Menuju alamat Anda" },
  { key: "completed", label: "Selesai", desc: "Pesanan telah diterima" },
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
      <div className="max-w-5xl mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-1 space-y-5">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !currentOrder) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border border-border rounded-2xl text-center space-y-4 bg-card shadow-xs">
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
    <div className="max-w-5xl mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 pb-12 w-full max-w-full min-w-0">
      {/* Header Halaman & Navigasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/user/orders"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center shrink-0 transition-colors shadow-xs active:scale-95"
            aria-label="Kembali ke daftar pesanan"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground truncate">
                Pesanan #{orderNumber}
              </h1>
              {isCancelled ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shrink-0">
                  Dibatalkan
                </span>
              ) : currentOrder.order_status === "completed" ? (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 shrink-0">
                  Selesai
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                  Dalam Proses
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dipesan pada:{" "}
              {currentOrder.ordered_at
                ? new Date(currentOrder.ordered_at).toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                : "-"}
            </p>
          </div>
        </div>

        {/* Tombol Aksi Cepat (Batal / Bayar) */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {isPending && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 hover:border-destructive/60 h-9 px-3 text-xs sm:text-sm font-medium cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5 mr-1.5" />
              Batalkan Pesanan
            </Button>
          )}

          {isUnpaid && !isCancelled && (
            <Button
              size="sm"
              className="h-9 px-4 text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
              nativeButton={false}
              render={<Link href={`/user/orders/${orderNumber}/payment`} />}
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              Bayar Sekarang
            </Button>
          )}
        </div>
      </div>

      {/* Timeline Stepper Status (jika tidak dibatalkan) */}
      {!isCancelled && (
        <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card mb-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3.5">
            <Truck className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Progres Pengantaran Komoditas
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {statusSteps.map((step, idx) => {
              const isPassed = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? "border-primary bg-primary/10 font-bold text-primary ring-2 ring-primary/20 shadow-xs"
                      : isPassed
                      ? "border-primary/40 bg-muted/40 font-semibold text-foreground"
                      : "border-border/60 bg-muted/10 text-muted-foreground/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] opacity-70">
                      0{idx + 1}
                    </span>
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-border" />
                    )}
                  </div>
                  <p className="font-semibold text-xs leading-tight mb-0.5 line-clamp-1">
                    {step.label}
                  </p>
                  <p className="text-[10px] opacity-75 line-clamp-1 leading-tight">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Notifikasi jika Dibatalkan */}
      {isCancelled && (
        <div className="p-4 sm:p-5 border rounded-2xl bg-destructive/5 border-destructive/30 mb-6 flex items-start gap-3.5 text-sm shadow-xs">
          <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-destructive text-sm sm:text-base">
              Pesanan Telah Dibatalkan
            </p>
            <p className="text-xs text-muted-foreground">
              Alasan:{" "}
              <strong className="text-foreground">
                {currentOrder.cancellation_reason || "Dibatalkan oleh pembeli."}
              </strong>
            </p>
            <p className="text-[11px] text-muted-foreground">
              Kuantitas stok produk telah dikembalikan utuh ke etalase pedagang pasar.
            </p>
          </div>
        </div>
      )}

      {/* Grid Konten Detail */}
      <div className="grid lg:grid-cols-3 gap-6 items-start w-full max-w-full min-w-0">
        {/* Kolom Kiri: Rincian Barang & Pengiriman (2 Cols) */}
        <div className="lg:col-span-2 space-y-6 w-full max-w-full min-w-0">
          {/* Daftar Barang Dipesan */}
          <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h2 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                Komoditas dari Kios Pasar Induk
              </h2>
              <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-muted">
                {currentOrder.items?.length || 0} Barang
              </span>
            </div>

            <div className="space-y-3">
              {currentOrder.items?.map((item) => {
                const storeName =
                  item.seller?.profile?.store_name ||
                  item.seller?.name ||
                  "Kios Pasar";
                const blockNumber = item.seller?.profile?.block_number;
                const marketName = item.seller?.profile?.market_name;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 w-full sm:w-auto">
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-muted border border-border/50">
                        <Image
                          src={item.product?.image_url || "/test.jpg"}
                          alt={item.product_name_snapshot}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-sm text-foreground line-clamp-1">
                          {item.product_name_snapshot}
                        </p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                          <Store className="w-3 h-3 text-primary shrink-0" />
                          <span>{storeName}</span>
                          {marketName && <span>&bull; {marketName}</span>}
                          {blockNumber && <span>({blockNumber})</span>}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {item.quantity} {item.unit_snapshot} &times; {item.formatted_price_at_purchase}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 shrink-0 gap-1.5">
                      <p className="font-bold text-sm text-foreground">
                        {item.formatted_subtotal}
                      </p>
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.pickup_status === "ready"
                            ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                            : item.pickup_status === "picked_up"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : item.pickup_status === "out_of_stock"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {item.pickup_status === "ready"
                          ? "Menunggu Kurir"
                          : item.pickup_status === "picked_up"
                          ? "Sudah Diambil Kurir"
                          : item.pickup_status === "out_of_stock"
                          ? "Stok Kios Kosong"
                          : "Penyiapan Kios"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alamat Pengiriman */}
          <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 pb-2.5 border-b border-border/60">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-sm sm:text-base text-foreground">
                Tujuan Pengiriman
              </h2>
            </div>
            <div className="text-xs space-y-1.5">
              <p className="font-semibold text-sm text-foreground">
                {address?.recipient_name || currentOrder.buyer?.name}
              </p>
              <p className="text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3 text-muted-foreground" />
                Telepon: {address?.phone || currentOrder.buyer?.phone}
              </p>
              {address?.store_name && (
                <p className="text-muted-foreground flex items-center gap-1">
                  <Store className="w-3 h-3 text-muted-foreground" />
                  Kios/Warung: {address.store_name}
                </p>
              )}
              <p className="text-foreground leading-relaxed pt-1 border-t border-border/40 mt-1">
                {address?.full_address || "Alamat belum diatur"}
              </p>
              {address?.latitude && address?.longitude && (
                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs font-semibold hover:bg-primary/10 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Buka Titik Pengiriman di Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Catatan Tambahan (jika ada) */}
          {currentOrder.notes && (
            <div className="p-4 border border-border rounded-2xl bg-muted/30 space-y-1 text-xs shadow-xs">
              <span className="font-semibold text-foreground">Catatan Pesanan:</span>
              <p className="text-muted-foreground leading-relaxed">{currentOrder.notes}</p>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Status Pembayaran & Kurir (1 Col) */}
        <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-6 w-full max-w-full min-w-0">
          {/* Kartu Status Pembayaran */}
          <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h2 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                <CreditCard className="w-4 h-4 text-primary" />
                Status Pembayaran
              </h2>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  currentOrder.payment_status === "paid"
                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                }`}
              >
                {currentOrder.payment_status === "paid" ? "Lunas" : "Belum Lunas"}
              </span>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Metode:</span>
                <span className="font-semibold text-foreground uppercase text-xs">
                  {currentOrder.payment?.payment_method === "cod"
                    ? "Cash on Delivery (COD)"
                    : currentOrder.payment?.payment_method === "manual_transfer"
                    ? "Transfer Bank Manual"
                    : "Belum Dipilih"}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal Komoditas:</span>
                <span className="font-medium text-foreground">
                  {currentOrder.formatted_subtotal_products}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Ongkir Pasar:</span>
                <span className="font-medium text-foreground">
                  {currentOrder.formatted_delivery_fee}
                </span>
              </div>
              <div className="border-t border-border/60 pt-2.5 flex justify-between items-baseline font-bold">
                <span className="text-sm text-foreground">Total Tagihan:</span>
                <span className="text-lg sm:text-xl font-extrabold text-primary">
                  {currentOrder.formatted_total_amount}
                </span>
              </div>
            </div>

            {isUnpaid && !isCancelled && (
              <Button
                className="w-full text-xs sm:text-sm font-semibold h-10 shadow-xs cursor-pointer"
                nativeButton={false}
                render={<Link href={`/user/orders/${orderNumber}/payment`} />}
              >
                Pilih / Selesaikan Pembayaran
              </Button>
            )}
          </div>

          {/* Kartu Informasi Kurir Lapangan */}
          <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card space-y-3.5 shadow-xs">
            <div className="flex items-center gap-2 pb-2.5 border-b border-border/60">
              <Truck className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-sm text-foreground">Kurir Pengantar</h2>
            </div>

            {currentOrder.courier ? (
              <div className="flex items-center gap-3 text-xs">
                <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-foreground truncate">
                    {currentOrder.courier.name}
                  </p>
                  <a
                    href={`tel:${currentOrder.courier.phone}`}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{currentOrder.courier.phone}</span>
                  </a>
                  <span className="inline-block mt-1 text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                    Kurir Resmi Pasar
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Menunggu penugasan kurir
                </p>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Kurir akan segera mengonfirmasi dan menjemput pesanan dari masing-masing kios lapak pasar.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog Pembatalan Pesanan */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="max-w-lg">
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
              disabled={isCancelling}
              onClick={() => setIsCancelModalOpen(false)}
            >
              Kembali
            </Button>
            <Button
              type="button"
              variant="destructive"
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
