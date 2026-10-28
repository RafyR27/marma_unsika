"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Package,
  Search,
  Store,
  MapPin,
  ExternalLink,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminProductCatalog } from "./useAdminProductCatalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function AdminProductCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    products,
    categories,
    meta,
    totalProductsCount,
    search,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    selectedCategory,
    setSelectedCategory,
    availabilityFilter,
    setAvailabilityFilter,
    page,
    setPage,
    isProductsLoading,
    isProductsError,
    refetchProducts,
  } = useAdminProductCatalog(initialCategory);

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
          Katalog komoditas master seluruh pasar hanya dapat diakses oleh tim admin pengelola operasional.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Admin
        </Button>
      </div>
    );
  }

  // Hitung jumlah unik seller lapak pada data terambil
  const uniqueSellers = new Set(
    products.map((p) => p.seller?.profile?.store_name || p.seller?.name)
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Katalog Komoditas Seluruh Pasar
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pengawasan terpusat etalase komoditas yang dipasarkan oleh seluruh kios lapak pasar induk.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetchProducts()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {/* 4 Kartu Metrik Katalog */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total Komoditas</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalProductsCount}</p>
          <span className="text-[11px] text-muted-foreground block">
            Di seluruh etalase pasar
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Kios Lapak Terdaftar</span>
            <Store className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary">{uniqueSellers.size}</p>
          <span className="text-[11px] text-muted-foreground block">
            Lapak pedagang aktif
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Kategori Komoditas</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{categories.length}</p>
          <span className="text-[11px] text-muted-foreground block">
            Kategori terkelola
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Komoditas Siap Jual</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {products.filter((p) => p.is_available && p.stock > 0).length}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Tersedia untuk dipesan
          </span>
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 border rounded-xl bg-card">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari komoditas cabai, bawang, sayuran..."
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
          {/* Dropdown Kategori */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background outline-none focus:border-ring cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Dropdown Status Ketersediaan */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background outline-none focus:border-ring cursor-pointer"
          >
            <option value="all">Semua Status Etalase</option>
            <option value="available">Hanya Tersedia (Ready)</option>
            <option value="out_of_stock">Stok Habis / Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Tabel Data Katalog Produk Master */}
      {isProductsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isProductsError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil data katalog produk dari server.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetchProducts()}>
            Coba Lagi
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <Package className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Tidak Ada Komoditas Ditemukan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search || selectedCategory !== "all" || availabilityFilter !== "all"
              ? "Tidak ada komoditas yang cocok dengan kriteria filter Anda."
              : "Belum ada komoditas terdaftar di pasar."}
          </p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground border-b text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Komoditas Pasar</th>
                  <th className="py-3.5 px-4">Kios Lapak & Blok</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Harga Grosir</th>
                  <th className="py-3.5 px-4">Sisa Stok Fisik</th>
                  <th className="py-3.5 px-4">Min. Beli</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {products.map((p) => {
                  const sellerProfile = p.seller?.profile;
                  const storeName =
                    sellerProfile?.store_name || p.seller?.name || "Kios Pasar";
                  const isAvailable = p.is_available && p.stock > 0;

                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      {/* Komoditas & Foto */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
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

                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-foreground text-sm block truncate">
                              {p.name}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground block truncate">
                              {p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kios Lapak & Blok */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-foreground block truncate">
                          {storeName}
                        </span>
                        {sellerProfile?.block_number ? (
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary shrink-0" />
                            {sellerProfile.block_number}
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">
                            Pasar Induk
                          </span>
                        )}
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-4">
                        <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                          {p.category?.name || "Umum"}
                        </span>
                      </td>

                      {/* Harga Grosir */}
                      <td className="py-3.5 px-4 font-bold text-primary">
                        {p.formatted_price}{" "}
                        <span className="font-normal text-muted-foreground text-[11px]">
                          /{p.unit}
                        </span>
                      </td>

                      {/* Stok Fisik */}
                      <td className="py-3.5 px-4 font-semibold">
                        <span
                          className={p.stock === 0 ? "text-destructive font-bold" : ""}
                        >
                          {p.stock} {p.unit}
                        </span>
                      </td>

                      {/* Minimal Beli */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {p.min_order} {p.unit}
                      </td>

                      {/* Status Ketersediaan */}
                      <td className="py-3.5 px-4">
                        {isAvailable ? (
                          <span className="inline-flex items-center text-[10px] font-semibold text-green-700 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                            Tersedia
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                            {p.stock === 0 ? "Habis" : "Nonaktif"}
                          </span>
                        )}
                      </td>

                      {/* Aksi: Buka Detail */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 font-semibold text-xs text-primary hover:underline"
                        >
                          Lihat
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginasi Master Produk */}
          {meta && meta.last_page > 1 && (
            <div className="p-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Halaman {meta.current_page} dari {meta.last_page} (Total: {meta.total} komoditas)
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
  );
}

export default function AdminProductCatalogSection() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <AdminProductCatalogContent />
    </Suspense>
  );
}
