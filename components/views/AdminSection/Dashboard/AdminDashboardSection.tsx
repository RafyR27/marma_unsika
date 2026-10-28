"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ShoppingCart,
  BookUser,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminDashboard } from "./useAdminDashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardSection() {
  const router = useRouter();
  const {
    user,
    isUserLoading,
    pendingVerificationCount,
    unverifiedPayments,
    isPaymentsLoading,
    unassignedCount,
    unassignedOrders,
    isUnassignedLoading,
    totalOrdersCount,
    totalUsersCount,
  } = useAdminDashboard();

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

  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Administrator</h2>
        <p className="text-sm text-muted-foreground">
          Dashboard pusat operasional ini hanya dapat diakses oleh akun admin pengelola pasar.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Banner Identitas Pusat Operasional */}
      <div className="p-5 border rounded-xl bg-card shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Pusat Operasional Pasar Makar
            </h1>
            <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400">
              Admin Pengelola
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Akun: <strong className="text-foreground">{user?.name}</strong> · Telp: {user?.phone} · Pengawasan Transaksi Pasar Induk ke Warung
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/verifikasi">
            <Button size="sm" className="font-semibold text-xs">
              <CreditCard className="w-4 h-4 mr-1.5" />
              Verifikasi Struk ({pendingVerificationCount})
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm" className="text-xs">
              <Truck className="w-4 h-4 mr-1.5 text-primary" />
              Dispatching Kurir ({unassignedCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Kartu Metrik Pasar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Antrean Verifikasi Transfer */}
        <Link href="/admin/verifikasi" className="block group">
          <div
            className={`p-4 rounded-xl border bg-card transition-all shadow-xs space-y-1 ${
              pendingVerificationCount > 0
                ? "border-amber-500/50 hover:border-amber-500"
                : "hover:border-primary"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Antrean Verifikasi</span>
              <CreditCard className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {pendingVerificationCount}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              Bukti transfer dana masuk
            </span>
          </div>
        </Link>

        {/* Metrik 2: Pesanan Butuh Kurir */}
        <Link href="/admin/orders" className="block group">
          <div
            className={`p-4 rounded-xl border bg-card transition-all shadow-xs space-y-1 ${
              unassignedCount > 0
                ? "border-blue-500/50 hover:border-blue-500"
                : "hover:border-primary"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Butuh Kurir</span>
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{unassignedCount}</p>
            <span className="text-[11px] text-muted-foreground block">
              Pesanan belum diklaim kurir
            </span>
          </div>
        </Link>

        {/* Metrik 3: Total Transaksi Pasar */}
        <Link href="/admin/orders" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-primary transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Transaksi</span>
              <ShoppingCart className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalOrdersCount}</p>
            <span className="text-[11px] text-muted-foreground block">
              Akumulasi pesanan tercatat
            </span>
          </div>
        </Link>

        {/* Metrik 4: Total Pengguna Terdaftar */}
        <Link href="/admin/users-management" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-primary transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Pengguna Pasar</span>
              <BookUser className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalUsersCount}</p>
            <span className="text-[11px] text-muted-foreground block">
              Pedagang, warung, & kurir
            </span>
          </div>
        </Link>
      </div>

      {/* Konten Terbagi 2 Kolom */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Kolom 1: Antrean Verifikasi Transfer Terdekat */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Antrean Verifikasi Struk</h2>
            </div>
            <Link
              href="/admin/verifikasi"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua ({pendingVerificationCount})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isPaymentsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : unverifiedPayments.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Tidak ada bukti transfer yang sedang menunggu verifikasi saat ini.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {unverifiedPayments.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-mono font-bold text-foreground block">
                      Pesanan #{p.order?.order_number || p.order_id}
                    </span>
                    <p className="text-muted-foreground truncate">
                      Pembeli: {p.order?.buyer?.name || "Pembeli"}
                    </p>
                    <p className="font-bold text-primary">
                      {p.formatted_amount_paid}
                    </p>
                  </div>

                  <Link href="/admin/verifikasi">
                    <Button size="xs" variant="outline" className="shrink-0 text-xs">
                      Periksa Struk
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2: Pesanan yang Membutuhkan Kurir */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Pesanan Butuh Kurir Lapangan</h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Semua ({unassignedCount})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isUnassignedLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : unassignedOrders.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Seluruh pesanan aktif telah memiliki kurir yang ditugaskan.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {unassignedOrders.slice(0, 4).map((o) => (
                <div
                  key={o.id}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground">
                        #{o.order_number}
                      </span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-700 px-1.5 py-0.2 rounded font-semibold">
                        Belum Ada Kurir
                      </span>
                    </div>
                    <p className="text-muted-foreground truncate">
                      Warung: {o.delivery_address_snapshot?.store_name || o.buyer?.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Ongkir: {o.formatted_delivery_fee} · Total: {o.formatted_total_amount}
                    </p>
                  </div>

                  <Link href="/admin/orders">
                    <Button size="xs" className="shrink-0 text-xs">
                      Tugaskan
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
