"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Navigation,
  Store,
  MapPin,
  Check,
  XCircle,
  Truck,
  Banknote,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  PackageCheck,
  Phone,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useActiveDeliveries } from "./useActiveDeliveries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function ActiveDeliveriesSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const {
    activeDeliveries,
    isLoading,
    isError,
    refetch,
    updatePickup,
    isUpdatingPickup,
    updateDeliveryStatus,
    isUpdatingDelivery,
  } = useActiveDeliveries();

  if (isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-80 w-full rounded-xl" />
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
          Halaman pengiriman aktif hanya dapat diakses oleh kurir resmi pasar yang terdaftar.
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
            <Navigation className="w-6 h-6 text-primary" />
            Pengiriman Aktif
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Rute penjemputan fisik barang di kios pasar induk dan konfirmasi serah terima ke warung pembeli.
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

      {/* Konten Pengiriman Aktif */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal memuat daftar pengiriman aktif.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : activeDeliveries.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-4 bg-muted/20">
          <Truck className="w-16 h-16 text-muted-foreground/40 mx-auto" />
          <h2 className="text-base font-bold">Tidak Ada Pengiriman Aktif</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Anda belum mengklaim tugas pengantaran baru. Cek halaman tugas tersedia untuk mengambil order.
          </p>
          <Link href="/courier/available-tasks">
            <Button size="sm" className="font-semibold">
              <ClipboardList className="w-4 h-4 mr-1.5" />
              Lihat Tugas Tersedia
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {activeDeliveries.map((delivery) => {
            const isPickingUp = delivery.order_status === "picking_up";
            const isCOD = delivery.payment?.payment_method === "cod";
            const address = delivery.delivery_address_snapshot;
            const buyerProfile = delivery.buyer?.profile;

            // Hitung status kelengkapan barang
            const items = delivery.items || [];
            const readyOrPickedItems = items.filter(
              (it) => it.pickup_status === "picked_up"
            );
            const allItemsPicked =
              items.length > 0 &&
              items.every((it) => it.pickup_status !== "waiting");

            return (
              <div
                key={delivery.id}
                className="border-2 rounded-2xl bg-card shadow-xs overflow-hidden border-primary/30"
              >
                {/* Header Status Bar Pengiriman */}
                <div className="p-5 bg-muted/40 border-b flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-extrabold text-foreground">
                        #{delivery.order_number}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isPickingUp
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                            : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {isPickingUp
                          ? "Fase 1: Jemput Barang di Kios"
                          : "Fase 2: Dalam Pengantaran ke Warung"}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Diterima:{" "}
                      {delivery.ordered_at
                        ? new Date(delivery.ordered_at).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "-"}{" "}
                      WIB
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block">
                      Upah Ongkir Kurir:
                    </span>
                    <span className="text-base font-bold text-primary">
                      {delivery.formatted_delivery_fee}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-6">
                  {/* Bagian 1: Checklist Penjemputan di Blok Kios */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
                        <Store className="w-4 h-4 text-primary" />
                        Checklist Fisik Barang Lapak ({readyOrPickedItems.length}/
                        {items.length} Barang Terambil)
                      </h3>
                      {allItemsPicked && (
                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Semua Lapak Selesai
                        </span>
                      )}
                    </div>

                    <div className="divide-y border rounded-xl overflow-hidden bg-background">
                      {items.map((item) => {
                        const sellerProfile = item.seller?.profile;
                        const storeName =
                          sellerProfile?.store_name ||
                          item.seller?.name ||
                          "Kios Pasar";
                        const blockNumber = sellerProfile?.block_number;
                        const isPicked = item.pickup_status === "picked_up";
                        const isOut = item.pickup_status === "out_of_stock";

                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                              isPicked ? "bg-green-500/5" : isOut ? "bg-destructive/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted border shrink-0">
                                <Image
                                  src={item.product?.image_url || "/test.jpg"}
                                  alt={item.product_name_snapshot}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>

                              <div className="space-y-0.5 min-w-0">
                                <p className="font-semibold text-sm text-foreground truncate">
                                  {item.product_name_snapshot}
                                </p>
                                <p className="text-primary font-bold">
                                  Kuantitas: {item.quantity} {item.unit_snapshot}
                                </p>
                                <p className="text-muted-foreground flex items-center gap-1 truncate">
                                  <Store className="w-3 h-3 text-muted-foreground" />
                                  <strong className="text-foreground">{storeName}</strong>
                                  {blockNumber && (
                                    <span className="text-amber-700 dark:text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.2 rounded">
                                      {blockNumber}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>

                            {/* Tombol Checklist Kurir */}
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <Button
                                variant="outline"
                                size="xs"
                                disabled={isUpdatingPickup}
                                onClick={() =>
                                  updatePickup({
                                    itemId: item.id,
                                    status: isOut ? "waiting" : "out_of_stock",
                                  })
                                }
                                className={`text-[11px] ${
                                  isOut
                                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    : "text-destructive hover:bg-destructive/10"
                                }`}
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                {isOut ? "Stok Kosong" : "Lapor Kosong"}
                              </Button>

                              <Button
                                size="xs"
                                disabled={isUpdatingPickup}
                                onClick={() =>
                                  updatePickup({
                                    itemId: item.id,
                                    status: isPicked ? "waiting" : "picked_up",
                                  })
                                }
                                className={`text-[11px] font-semibold ${
                                  isPicked
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : ""
                                }`}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                {isPicked ? "Sudah Diambil" : "Ambil Barang"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bagian 2: Alamat Tujuan Warung */}
                  <div className="p-4 rounded-xl border bg-muted/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        Tujuan Pengantaran Warung:
                      </span>
                      {address?.phone && (
                        <a
                          href={`tel:${address.phone}`}
                          className="text-primary hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Phone className="w-3 h-3" />
                          Hubungi Pembeli
                        </a>
                      )}
                    </div>

                    <p className="font-semibold text-sm text-foreground">
                      {address?.recipient_name || delivery.buyer?.name} (
                      {address?.store_name || buyerProfile?.store_name || "Warung"}
                      )
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {address?.full_address || "Alamat belum tercatat"}
                    </p>
                    {delivery.notes && (
                      <p className="p-2 bg-background border rounded text-muted-foreground mt-1">
                        <strong className="text-foreground">Catatan Pembeli: </strong>
                        {delivery.notes}
                      </p>
                    )}
                  </div>

                  {/* Bagian 3: Instruksi Pembayaran Tagihan */}
                  <div className="p-3.5 rounded-xl border text-xs flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-muted-foreground block">
                        Kewajiban Pembayaran:
                      </span>
                      {isCOD ? (
                        <p className="font-bold text-amber-600 flex items-center gap-1.5 text-sm">
                          <Banknote className="w-4 h-4" />
                          Wajib Tagih Tunai COD: {delivery.formatted_total_amount}
                        </p>
                      ) : (
                        <p className="font-bold text-green-600 flex items-center gap-1.5 text-sm">
                          <PackageCheck className="w-4 h-4" />
                          Sudah Lunas via Transfer (Jangan minta uang tunai)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tombol Aksi Utama Sesuai Status */}
                  <div className="pt-2">
                    {isPickingUp ? (
                      <Button
                        size="lg"
                        disabled={isUpdatingDelivery}
                        onClick={() =>
                          updateDeliveryStatus({
                            orderNumber: delivery.order_number,
                            status: "in_transit",
                          })
                        }
                        className="w-full font-bold text-sm h-11"
                      >
                        {isUpdatingDelivery ? (
                          <>
                            <Spinner className="mr-2" />
                            Memproses Rute...
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4 mr-2" />
                            Selesai Ambil Barang — Berangkat ke Warung (In Transit)
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        disabled={isUpdatingDelivery}
                        onClick={() =>
                          updateDeliveryStatus({
                            orderNumber: delivery.order_number,
                            status: "completed",
                          })
                        }
                        className="w-full font-bold text-sm h-11 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isUpdatingDelivery ? (
                          <>
                            <Spinner className="mr-2" />
                            Menyelesaikan Pengantaran...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            {isCOD
                              ? `Uang COD Diterima — Selesaikan Pengantaran`
                              : "Barang Diserahkan — Selesaikan Pengantaran"}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
