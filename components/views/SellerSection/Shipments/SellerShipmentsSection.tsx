"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  PackageCheck,
  User,
  Boxes,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useSellerShipments } from "./useSellerShipments";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerShipmentsSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { activeShipments, completedShipments, isLoading, isError, refetch } =
    useSellerShipments();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
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
          Pemantauan logistik pengiriman komoditas lapak hanya dapat diakses oleh mitra penjual resmi.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Seller
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
            <Truck className="w-6 h-6 text-primary" />
            Pemantauan Pengiriman Barang Kios
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Lacak pergerakan kurir yang sedang menjemput atau mengantar komoditas segar Anda ke warung pembeli.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Status
        </Button>
      </div>

      {/* 2 Kartu Metrik Pengiriman */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-blue-500/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              Sedang Dalam Perjalanan Kurir
            </span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-600">
            {activeShipments.length} Pengiriman Aktif
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Komoditas telah siap / dijemput kurir
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-green-500/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-green-700 dark:text-green-400">
              Pengantaran Tuntas Selesai
            </span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-extrabold text-green-600">
            {completedShipments.length} Pesanan Diterima
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Barang telah sampai di tangan pembeli
          </span>
        </div>
      </div>

      {/* Daftar Pengiriman Aktif Berjalan */}
      <div className="space-y-4">
        <h2 className="font-bold text-base text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Pengiriman yang Sedang Berjalan ({activeShipments.length})
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
            <p className="text-sm text-destructive font-medium">
              Gagal mengambil data pengiriman berjalan.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Coba Lagi
            </Button>
          </div>
        ) : activeShipments.length === 0 ? (
          <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
            <PackageCheck className="w-14 h-14 text-muted-foreground/40 mx-auto" />
            <h3 className="font-semibold text-base">Tidak Ada Pengiriman Berjalan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Seluruh barang kios telah selesai diantar atau masih menunggu pemesanan baru dari pembeli warung.
            </p>
            <Link href="/seller/orders">
              <Button size="sm" variant="outline" className="text-xs">
                Cek Pesanan Masuk
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeShipments.map((shipment) => {
              const isPickingUp = shipment.order_status === "picking_up";
              const courier = shipment.courier;
              const address = shipment.delivery_address_snapshot;
              const buyerProfile = shipment.buyer?.profile;

              return (
                <div
                  key={shipment.id}
                  className="p-5 border-2 rounded-2xl bg-card shadow-xs space-y-4 border-blue-500/30 hover:border-blue-500 transition-all"
                >
                  {/* Header Status Pengiriman */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground text-sm">
                        #{shipment.order_number}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {shipment.ordered_at
                          ? new Date(shipment.ordered_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}{" "}
                        WIB
                      </span>
                    </div>

                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                        isPickingUp
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {isPickingUp
                        ? "Kurir Sedang Menjemput di Kios"
                        : "Kurir Dalam Perjalanan Menuju Warung"}
                    </span>
                  </div>

                  {/* Info Kurir & Tujuan */}
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    {/* Kurir Armada */}
                    <div className="p-3.5 rounded-lg border bg-muted/40 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <User className="w-4 h-4 text-primary" />
                        <span>Kurir Lapangan Bertugas:</span>
                      </div>
                      {courier ? (
                        <>
                          <p className="font-semibold text-sm text-foreground">
                            {courier.name}
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {courier.phone}
                          </p>
                        </>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Menunggu penetapan kurir lapangan...
                        </p>
                      )}
                    </div>

                    {/* Tujuan Warung */}
                    <div className="p-3.5 rounded-lg border bg-muted/40 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Tujuan Pengantaran:</span>
                      </div>
                      <p className="font-semibold text-sm text-foreground">
                        {address?.store_name || address?.recipient_name || buyerProfile?.store_name || shipment.buyer?.name}
                      </p>
                      <p className="text-muted-foreground truncate">
                        {address?.full_address || "Alamat tercatat"}
                      </p>
                    </div>
                  </div>

                  {/* Daftar Komoditas Kios */}
                  <div className="border-t pt-2 space-y-1 text-xs">
                    <span className="font-semibold text-muted-foreground text-[11px] uppercase tracking-wider block">
                      Barang Kios Anda yang Diangkut:
                    </span>
                    {shipment.items?.map((it) => (
                      <div key={it.id} className="flex justify-between py-1">
                        <span className="font-medium text-foreground">
                          {it.product_name_snapshot} ({it.quantity} {it.unit_snapshot})
                        </span>
                        <span className="font-bold text-primary">
                          {it.formatted_subtotal}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
