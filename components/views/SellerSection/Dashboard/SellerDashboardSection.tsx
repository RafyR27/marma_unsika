"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Store,
  MapPin,
  Boxes,
  Package,
  AlertTriangle,
  ClipboardList,
  Plus,
  ArrowRight,
  ShieldAlert,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";

import { useSellerDashboard } from "./useSellerDashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerDashboardSection() {
  const router = useRouter();
  const {
    user,
    isUserLoading,
    incomingItems,
    isIncomingLoading,
    products,
    isProductsLoading,
    totalOrders,
    lowStockCount,
  } = useSellerDashboard();

  if (isUserLoading) {
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

  const isSeller = user?.role === "seller" || user?.role === "admin";
  if (!isSeller) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Terbatas untuk Penjual</h2>
        <p className="text-sm text-muted-foreground">
          Dashboard ini khusus untuk mitra pedagang pasar yang terdaftar.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Seller
        </Button>
      </div>
    );
  }

  const profile = user?.profile;
  const storeName = profile?.store_name || user?.name || "Kios Pasar";

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Profil Kios & Banner Identitas */}
      <div className="p-5 border rounded-xl bg-card shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">{storeName}</h1>
            <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Mitra Lapak Aktif
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {profile?.market_name && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {profile.market_name}
                {profile.block_number && ` (${profile.block_number})`}
              </span>
            )}
            <span>Pemilik: {user?.name}</span>
            <span>Telp: {user?.phone}</span>
          </div>
        </div>

        {/* Shortcut Tombol Kios */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/seller/orders">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <Boxes className="w-4 h-4 text-primary" />
              Antrean Kemas ({incomingItems.length})
            </Button>
          </Link>
          <Link href="/seller/products">
            <Button size="sm" className="flex items-center gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              Tambah Produk
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Kartu Metrik Kios Utama */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metrik 1: Antrean Kemas */}
        <Link href="/seller/orders" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-primary transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Perlu Disiapkan</span>
              <Boxes className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{incomingItems.length}</p>
            <span className="text-[11px] text-muted-foreground block">
              Komoditas menunggu kemas
            </span>
          </div>
        </Link>

        {/* Metrik 2: Komoditas di Etalase */}
        <Link href="/seller/products" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-primary transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Etalase Kios</span>
              <Package className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{products.length}</p>
            <span className="text-[11px] text-muted-foreground block">
              Total komoditas terdaftar
            </span>
          </div>
        </Link>

        {/* Metrik 3: Stok Menipis */}
        <Link href="/seller/inventory" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-amber-500 transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Stok Menipis</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-amber-500">{lowStockCount}</p>
            <span className="text-[11px] text-muted-foreground block">
              Perlu kulakan pasokan baru
            </span>
          </div>
        </Link>

        {/* Metrik 4: Total Pesanan Masuk */}
        <Link href="/seller/orders" className="block group">
          <div className="p-4 rounded-xl border bg-card hover:border-primary transition-all shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Faktur Pesanan</span>
              <ClipboardList className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{totalOrders}</p>
            <span className="text-[11px] text-muted-foreground block">
              Total pesanan diterima
            </span>
          </div>
        </Link>
      </div>

      {/* Konten Terbagi 2 Kolom */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Kolom 1: Antrean Kemas Barang Mendesak */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Antrean Kemas Terdekat</h2>
            </div>
            <Link
              href="/seller/orders"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua ({incomingItems.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isIncomingLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : incomingItems.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Tidak ada barang yang sedang menunggu dikemas saat ini.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {incomingItems.slice(0, 4).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
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
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{item.product_name_snapshot}</p>
                      <p className="text-muted-foreground mt-0.5">
                        Kuantitas: <strong className="text-foreground">{item.quantity} {item.unit_snapshot}</strong>
                      </p>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        #{item.order?.order_number}
                      </p>
                    </div>
                  </div>

                  <Link href="/seller/orders">
                    <Button variant="outline" size="xs" className="shrink-0 text-xs">
                      Siapkan
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2: Etalase Komoditas Kios */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Etalase Komoditas Kios</h2>
            </div>
            <Link
              href="/seller/products"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Kelola ({products.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isProductsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 border rounded-lg text-center space-y-2 bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Belum ada komoditas terdaftar di etalase kios Anda.
              </p>
              <Link href="/seller/products">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Tambah Komoditas Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {products.slice(0, 4).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted border shrink-0">
                      <Image
                        src={p.image_url || "/test.jpg"}
                        alt={p.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{p.name}</p>
                      <p className="text-primary font-bold mt-0.5">
                        {p.formatted_price} <span className="font-normal text-muted-foreground">/{p.unit}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="font-semibold text-foreground">
                      Stok: {p.stock} {p.unit}
                    </p>
                    <span
                      className={`inline-block text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                        p.stock === 0
                          ? "bg-destructive/10 text-destructive"
                          : p.stock <= 20
                          ? "bg-amber-500/10 text-amber-600"
                          : "bg-green-500/10 text-green-700"
                      }`}
                    >
                      {p.stock === 0 ? "Habis" : p.stock <= 20 ? "Menipis" : "Aman"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
