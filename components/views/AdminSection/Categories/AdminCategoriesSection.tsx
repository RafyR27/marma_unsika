"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Apple,
  Search,
  Package,
  Layers,
  ArrowRight,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  FolderTree,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminCategories } from "./useAdminCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoriesSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    categories,
    rawCategoriesCount,
    totalCommodities,
    search,
    setSearch,
    isLoading,
    isError,
    refetch,
  } = useAdminCategories();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
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
          Pengelolaan taksonomi dan master kategori pasar hanya dapat diakses oleh tim admin operasional.
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
            <Apple className="w-6 h-6 text-primary" />
            Master Kategori Komoditas Pasar
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Daftar pengelompokan resmi komoditas buah segar, sayuran, dan bumbu dapur untuk seluruh etalase pedagang.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Data
        </Button>
      </div>

      {/* 3 Kartu Metrik Kategori */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total Kategori Master</span>
            <FolderTree className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{rawCategoriesCount}</p>
          <span className="text-[11px] text-muted-foreground block">
            Kategori aktif di sistem
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Komoditas Terkategori</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary">{totalCommodities}</p>
          <span className="text-[11px] text-muted-foreground block">
            Total barang dagangan terdaftar
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Rata-rata per Kategori</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {rawCategoriesCount > 0
              ? (totalCommodities / rawCategoriesCount).toFixed(1)
              : 0}
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Komoditas per kategori
          </span>
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="flex items-center justify-between gap-3 p-3.5 border rounded-xl bg-card">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Cari nama kategori buah, sayur, bumbu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <span className="text-xs text-muted-foreground hidden sm:inline">
          Menampilkan {categories.length} dari {rawCategoriesCount} kategori
        </span>
      </div>

      {/* Grid Kartu Kategori */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil data kategori komoditas dari server.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : categories.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <FolderTree className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Kategori Tidak Ditemukan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Tidak ada kategori yang cocok dengan kata kunci &quot;{search}&quot;.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl bg-card overflow-hidden shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3.5">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted border shrink-0">
                    <Image
                      src={c.image_url || "/test.jpg"}
                      alt={c.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate">
                      {c.name}
                    </h3>
                    <p className="font-mono text-[11px] text-muted-foreground truncate">
                      slug: {c.slug}
                    </p>
                    <span className="inline-block text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.2 rounded-full mt-1">
                      {c.products_count ?? 0} Komoditas Aktif
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Kartu & Link ke Katalog Terfilter */}
              <div className="p-3 bg-muted/30 border-t flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">
                  ID Kategori: #{c.id}
                </span>

                <Link
                  href={`/admin/product-catalog?category=${c.slug}`}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  Buka Katalog
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
