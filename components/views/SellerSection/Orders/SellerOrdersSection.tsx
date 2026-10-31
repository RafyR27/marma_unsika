"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Boxes,
  ClipboardList,
  Check,
  XCircle,
  Truck,
  User,
  MapPin,
  Clock,
  AlertCircle,
  RefreshCw,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useSellerOrders, SellerOrderTab } from "./useSellerOrders";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function SellerOrdersSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();

  const {
    activeTab,
    setActiveTab,
    orderStatusFilter,
    setOrderStatusFilter,
    page,
    setPage,
    incomingItems,
    isIncomingLoading,
    isIncomingError,
    refetchIncoming,
    orders,
    meta,
    isOrdersLoading,
    isOrdersError,
    refetchOrders,
    updateItemStatus,
    isUpdatingStatus,
  } = useSellerOrders();

  if (isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
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
          Halaman pesanan masuk hanya dapat diakses oleh akun mitra pedagang pasar yang terdaftar.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Ke Beranda
          </Button>
          <Button onClick={() => router.push("/auth/login")}>
            Masuk sebagai Seller
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
          <h1 className="text-2xl font-bold tracking-tight">Pesanan Masuk Kios</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pantau antrean barang yang harus dikemas dan kelola pesanan masuk dari pembeli warung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (activeTab === "incoming") refetchIncoming();
              else refetchOrders();
            }}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs Navigasi Utama */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === "incoming"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Antrean Siapkan Barang</span>
          {incomingItems.length > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full size-4.5 flex items-center justify-center">
              {incomingItems.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === "orders"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Faktur Pesanan Masuk</span>
        </button>
      </div>

      {/* TAB 1: ANTREAN KEMAS BARANG */}
      {activeTab === "incoming" && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
            <p>
              Daftar komoditas pada pesanan terkonfirmasi yang sedang menunggu Anda kemas sebelum kurir lapangan tiba di kios.
            </p>
            <span className="font-semibold text-foreground shrink-0 ml-2">
              Auto-refresh setiap 15 detik
            </span>
          </div>

          {isIncomingLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : isIncomingError ? (
            <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm text-destructive font-medium">
                Gagal memuat antrean komoditas.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetchIncoming()}>
                Coba Lagi
              </Button>
            </div>
          ) : incomingItems.length === 0 ? (
            <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
              <Boxes className="w-14 h-14 text-muted-foreground/40 mx-auto" />
              <h3 className="font-semibold text-base">Antrean Kemas Bersih</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Semua barang dagangan telah disiapkan atau belum ada pesanan baru yang masuk.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingItems.map((item) => {
                const o = item.order;
                const buyerProfile = o?.buyer?.profile;
                const courier = o?.courier;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl bg-card gap-4 shadow-xs hover:border-primary/40 transition-colors"
                  >
                    {/* Info Komoditas & Foto */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted border shrink-0">
                        <Image
                          src={item.product?.image_url || "/test.jpg"}
                          alt={item.product_name_snapshot}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-foreground">
                            #{o?.order_number}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
                            Menunggu Dikemas
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-foreground leading-snug truncate">
                          {item.product_name_snapshot}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <p className="font-bold text-sm text-primary">
                            Kuantitas: {item.quantity} {item.unit_snapshot}
                          </p>
                          <p>Total: {item.formatted_subtotal}</p>
                        </div>

                        {/* Info Pemesan & Kurir */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground pt-1">
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <User className="w-3 h-3 text-primary" />
                            {buyerProfile?.store_name || o?.buyer?.name || "Warung Pembeli"}
                          </span>
                          {courier ? (
                            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                              <Truck className="w-3 h-3" />
                              Dijemput oleh: {courier.name}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              Menunggu klaim kurir
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tombol Aksi Kios */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdatingStatus}
                        onClick={() =>
                          updateItemStatus({
                            itemId: item.id,
                            status: "out_of_stock",
                          })
                        }
                        className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Stok Kosong
                      </Button>

                      <Button
                        size="sm"
                        disabled={isUpdatingStatus}
                        onClick={() =>
                          updateItemStatus({
                            itemId: item.id,
                            status: "picked_up",
                          })
                        }
                        className="text-xs font-semibold"
                      >
                        {isUpdatingStatus ? (
                          <Spinner className="mr-1" />
                        ) : (
                          <Check className="w-3.5 h-3.5 mr-1" />
                        )}
                        Tandai Siap
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FAKTUR PESANAN MASUK */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Filter Status Order */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { key: "all", label: "Semua Faktur" },
              { key: "confirmed", label: "Dikonfirmasi" },
              { key: "picking_up", label: "Dijemput Kurir" },
              { key: "in_transit", label: "Dalam Pengiriman" },
              { key: "completed", label: "Selesai" },
              { key: "cancelled", label: "Dibatalkan" },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setOrderStatusFilter(st.key)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer shrink-0 ${
                  orderStatusFilter === st.key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {isOrdersLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : isOrdersError ? (
            <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm text-destructive font-medium">
                Gagal memuat riwayat faktur pesanan masuk.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetchOrders()}>
                Coba Lagi
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
              <ClipboardList className="w-14 h-14 text-muted-foreground/40 mx-auto" />
              <h3 className="font-semibold text-base">Tidak Ada Pesanan Ditemukan</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Belum ada faktur pesanan yang cocok dengan kriteria filter yang Anda pilih.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => {
                const buyerProfile = o.buyer?.profile;
                const courier = o.courier;

                return (
                  <div
                    key={o.id}
                    className="p-5 border rounded-xl bg-card space-y-3 shadow-xs hover:border-primary/40 transition-colors"
                  >
                    {/* Header Faktur */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-foreground">
                          #{o.order_number}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">
                          {o.ordered_at
                            ? new Date(o.ordered_at).toLocaleString("id-ID", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "-"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold px-2.5 py-0.5 rounded-full ${
                            o.order_status === "completed"
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : o.order_status === "cancelled"
                              ? "bg-destructive/10 text-destructive"
                              : o.order_status === "picking_up"
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {o.order_status === "pending"
                            ? "Menunggu"
                            : o.order_status === "confirmed"
                            ? "Dikonfirmasi"
                            : o.order_status === "picking_up"
                            ? "Kurir Menjemput"
                            : o.order_status === "in_transit"
                            ? "Dalam Pengiriman"
                            : o.order_status === "completed"
                            ? "Selesai"
                            : "Dibatalkan"}
                        </span>
                      </div>
                    </div>

                    {/* Informasi Pembeli & Kurir */}
                    <div className="grid sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Toko / Warung Pemesan:</span>
                        <p className="font-semibold text-foreground">
                          {buyerProfile?.store_name || o.buyer?.name}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          Telp: {o.buyer?.phone}
                        </p>
                      </div>

                      <div>
                        <span className="text-muted-foreground block">Kurir Lapangan:</span>
                        {courier ? (
                          <p className="font-semibold text-foreground flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-primary" />
                            {courier.name} ({courier.phone})
                          </p>
                        ) : (
                          <p className="text-muted-foreground text-[11px]">
                            Belum ada kurir ditugaskan
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rincian Komoditas di Lapak Ini */}
                    <div className="border-t pt-2 space-y-1.5">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                        Barang dari Kios Anda:
                      </span>
                      {o.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-xs py-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {item.product_name_snapshot}
                            </span>
                            <span className="text-muted-foreground">
                              ({item.quantity} {item.unit_snapshot})
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                                item.pickup_status === "picked_up"
                                  ? "bg-green-500/10 text-green-700"
                                  : item.pickup_status === "out_of_stock"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {item.pickup_status === "picked_up"
                                ? "Siap / Diambil"
                                : item.pickup_status === "out_of_stock"
                                ? "Stok Kosong"
                                : "Menunggu Kemas"}
                            </span>
                          </div>

                          <span className="font-semibold">{item.formatted_subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Paginasi Faktur Pesanan */}
              {meta && meta.last_page > 1 && (
                <div className="p-3 border rounded-xl flex items-center justify-between text-xs text-muted-foreground bg-card">
                  <span>
                    Halaman {meta.current_page} dari {meta.last_page} (Total: {meta.total} faktur)
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
        </div>
      )}
    </div>
  );
}
