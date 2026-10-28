"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  ClipboardList,
  Navigation,
  History,
  Banknote,
  MapPin,
  ArrowRight,
  ShieldAlert,
  User,
  CheckCircle2,
  Clock,
  Store,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useCourierDashboard } from "./useCourierDashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourierDashboardSection() {
  const router = useRouter();
  const {
    user,
    isUserLoading,
    availableTasks,
    isAvailableLoading,
    activeDeliveries,
    completedDeliveries,
    totalEarnings,
    isDeliveriesLoading,
  } = useCourierDashboard();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isUserLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
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
          Dashboard ini khusus untuk kurir lapangan resmi pasar yang terdaftar.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Kurir
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Banner Profil Kurir */}
      <div className="p-5 border rounded-xl bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {user?.name || "Kurir Pasar"}
              </h1>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400">
                Siap Tugas
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Armada Lapangan Pasar Induk · No. Telp: {user?.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/courier/available-tasks">
            <Button size="sm" className="font-semibold text-xs">
              <ClipboardList className="w-4 h-4 mr-1.5" />
              Ambil Tugas ({availableTasks.length})
            </Button>
          </Link>
          <Link href="/courier/active-deliveries">
            <Button variant="outline" size="sm" className="text-xs">
              <Navigation className="w-4 h-4 mr-1.5 text-primary" />
              Rute Aktif ({activeDeliveries.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Kartu Metrik Kurir */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Tugas Tersedia */}
        <Link href="/courier/available-tasks" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-primary transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Tugas Tersedia</span>
              <ClipboardList className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{availableTasks.length}</p>
            <span className="text-[11px] text-muted-foreground block">
              Siap diklaim kurir
            </span>
          </div>
        </Link>

        {/* Metrik 2: Pengiriman Aktif */}
        <Link href="/courier/active-deliveries" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-blue-500 transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Pengiriman Aktif</span>
              <Navigation className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{activeDeliveries.length}</p>
            <span className="text-[11px] text-muted-foreground block">
              Sedang dijemput / diantar
            </span>
          </div>
        </Link>

        {/* Metrik 3: Pengantaran Selesai */}
        <Link href="/courier/history" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-green-500 transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Pengiriman Tuntas</span>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              {completedDeliveries.length}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              Telah diserahkan ke warung
            </span>
          </div>
        </Link>

        {/* Metrik 4: Akumulasi Ongkos Kirim */}
        <Link href="/courier/history" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-primary transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Upah Ongkir</span>
              <Banknote className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl font-extrabold text-foreground truncate">
              Rp {totalEarnings.toLocaleString("id-ID")}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              Dari pesanan selesai
            </span>
          </div>
        </Link>
      </div>

      {/* Konten Terbagi 2 Kolom */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Kolom 1: Pengiriman yang Sedang Berjalan */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Rute Pengiriman Berjalan</h2>
            </div>
            <Link
              href="/courier/active-deliveries"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Detail ({activeDeliveries.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isDeliveriesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : activeDeliveries.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Tidak ada tugas pengiriman yang sedang berjalan saat ini.
              </p>
              <Link href="/courier/available-tasks">
                <Button size="sm" variant="outline" className="text-xs">
                  Klaim Tugas Baru
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {activeDeliveries.slice(0, 3).map((d) => {
                const address = d.delivery_address_snapshot;
                const isPickingUp = d.order_status === "picking_up";

                return (
                  <div
                    key={d.id}
                    className="py-3.5 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">
                          #{d.order_number}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                            isPickingUp
                              ? "bg-amber-500/10 text-amber-700"
                              : "bg-blue-500/10 text-blue-700"
                          }`}
                        >
                          {isPickingUp ? "Ambil di Kios" : "Dalam Pengantaran"}
                        </span>
                      </div>

                      <p className="text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-primary" />
                        <span className="truncate">
                          Tujuan: {address?.recipient_name || d.buyer?.name} (
                          {address?.store_name || "Warung"})
                        </span>
                      </p>

                      <p className="text-[11px] text-muted-foreground">
                        Muatan: {d.items?.length || 0} komoditas · Ongkir: {d.formatted_delivery_fee}
                      </p>
                    </div>

                    <Link href="/courier/active-deliveries">
                      <Button size="xs" className="shrink-0 text-xs">
                        Buka Rute
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Kolom 2: Tugas Baru yang Siap Diambil */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Tugas Baru Tersedia</h2>
            </div>
            <Link
              href="/courier/available-tasks"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Semua ({availableTasks.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isAvailableLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : availableTasks.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Belum ada pesanan baru yang menunggu kurir saat ini.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {availableTasks.slice(0, 3).map((t) => {
                const address = t.delivery_address_snapshot;

                return (
                  <div
                    key={t.id}
                    className="py-3.5 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="font-mono font-bold text-sm text-foreground">
                        #{t.order_number}
                      </span>
                      <p className="text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0 text-primary" />
                        <span className="truncate">
                          {address?.store_name || address?.recipient_name || t.buyer?.name}
                        </span>
                      </p>
                      <p className="font-bold text-primary">
                        Ongkos Kirim: {t.formatted_delivery_fee}
                      </p>
                    </div>

                    <Link href="/courier/available-tasks">
                      <Button variant="outline" size="xs" className="shrink-0 text-xs">
                        Klaim Tugas
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
