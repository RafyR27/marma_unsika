"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMe } from "@/hooks/useMe";
import { useSellerDashboard } from "./useSellerDashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Package,
  ClipboardList,
} from "lucide-react";

// useSyncExternalStore digunakan untuk mendeteksi client mount secara aman tanpa
// memicu peringatan 'set-state-in-effect' pada React 19 dan Next.js Turbopack.
const emptySubscribe = () => () => {};

export default function SellerDashboardSection() {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { data: user, isLoading: isCheckingAuth } = useMe();

  const {
    products,
    stats,
    urgentStockItems,
    recentProducts,
    categoryDistribution,
    isLoading,
    isError,
    refetch,
  } = useSellerDashboard();

  if (!isMounted || isCheckingAuth) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            Sesi Masuk Diperlukan
          </h2>
          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
            Silakan masuk dengan akun mitra penjual untuk mengelola etalase dan persediaan kios pasar Anda.
          </p>
          <Link href="/auth/login">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-10">
              Masuk ke Akun
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSeller = user.role === "seller" || user.role === "admin";
  if (!isSeller) {
    return (
      <div className="max-w-md mx-auto my-16 px-4">
        <div className="bg-white rounded-2xl border border-neutral-200/90 p-8 text-center shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            Akses Khusus Mitra Penjual
          </h2>
          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
            Akun Anda terdaftar sebagai <span className="font-semibold text-neutral-900 capitalize">{user.role}</span>.
            Dashboard ini dirancang khusus untuk pedagang kios pasar mitra MARMA.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" className="border-neutral-300">
                Kembali ke Beranda
              </Button>
            </Link>
            <Link href="/products">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                Jelajahi Pasar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const profile = user.profile;
  const storeName = profile?.store_name || "Kios Mitra MARMA";
  const marketName = profile?.market_name || "Pasar Tradisional";
  const blockNumber = profile?.block_number ? `Blok ${profile.block_number}` : null;
  const fullAddress = profile?.full_address || "Alamat kios belum dilengkapi";

  const totalRestockCount = stats.lowStockProducts + stats.outOfStockProducts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. Header Identitas Kios & Aksi Cepat */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Mitra Kios Terverifikasi
              </span>
              {blockNumber && (
                <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200/60">
                  {blockNumber}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              {storeName}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-neutral-500">
              <span>
                Pengelola: <strong className="font-semibold text-neutral-800">{user.name}</strong>
              </span>
              <span>&bull;</span>
              <span>{marketName}</span>
              <span>&bull;</span>
              <span>{fullAddress}</span>
              {user.phone && (
                <>
                  <span>&bull;</span>
                  <span>{user.phone}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 pt-1 lg:pt-0 shrink-0">
            <Link href="/seller/orders">
              <Button
                variant="outline"
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 text-sm h-10 px-4 rounded-lg transition-colors font-medium flex items-center gap-1.5"
              >
                <ClipboardList className="w-4 h-4 text-emerald-600" />
                Pesanan Masuk
              </Button>
            </Link>
            <Link href="/seller/products">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm h-10 px-4 rounded-lg shadow-sm transition-colors">
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Komoditas
              </Button>
            </Link>
            <Link href="/seller/inventory">
              <Button
                variant="outline"
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 text-sm h-10 px-4 rounded-lg transition-colors font-medium"
              >
                Kelola Stok
              </Button>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-emerald-700 font-medium py-2.5 px-3 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-neutral-200/70 transition-colors"
              title="Buka etalase pasar publik di tab baru"
            >
              <span>Katalog Publik</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Error State */}
      {isError && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Terjadi kendala saat menyinkronkan data kios dari server.</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="border-rose-300 text-rose-700 hover:bg-rose-100 bg-white text-xs h-8 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Coba Lagi
          </Button>
        </div>
      )}

      {/* 3. Kartu Ringkasan Operasional Kios */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Ringkasan Persediaan &amp; Nilai Aset
          </h2>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="text-xs text-neutral-500 hover:text-neutral-800 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`}
            />
            <span>Segarkan Data</span>
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Metrik 1: Total Komoditas */}
            <div className="p-5 rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-colors">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 block">
                Total Komoditas
              </span>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-neutral-900">
                  {stats.totalProducts}
                </span>
                <span className="text-xs font-medium text-neutral-500">jenis</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1.5">
                Terdaftar di katalog kios
              </p>
            </div>

            {/* Metrik 2: Komoditas Aktif */}
            <div className="p-5 rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-colors">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 block">
                Komoditas Aktif
              </span>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-neutral-900">
                  {stats.activeProducts}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  / {stats.totalProducts} produk
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1.5">
                Tampil aktif di etalase pasar
              </p>
            </div>

            {/* Metrik 3: Perlu Restock */}
            <div className="p-5 rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-colors">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 block">
                Perlu Restock
              </span>
              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span
                  className={`text-3xl font-bold tracking-tight ${
                    totalRestockCount > 0 ? "text-amber-600" : "text-neutral-900"
                  }`}
                >
                  {totalRestockCount}
                </span>
                <span className="text-xs font-medium text-neutral-500">komoditas</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1.5">
                {stats.outOfStockProducts > 0 ? (
                  <>
                    <strong className="font-semibold text-rose-600">
                      {stats.outOfStockProducts} habis
                    </strong>
                    {stats.lowStockProducts > 0 && `, ${stats.lowStockProducts} menipis`}
                  </>
                ) : stats.lowStockProducts > 0 ? (
                  `${stats.lowStockProducts} stok di bawah batas minimal`
                ) : (
                  "Semua persediaan aman"
                )}
              </p>
            </div>

            {/* Metrik 4: Estimasi Nilai Persediaan */}
            <div className="p-5 rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-neutral-300 transition-colors">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 block">
                Nilai Persediaan
              </span>
              <div className="mt-2.5">
                <span className="text-2xl font-bold tracking-tight text-neutral-900 block truncate">
                  {stats.formattedInventoryValue}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1.5">
                Kalkulasi harga &times; stok fisik
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Prioritas Persediaan Kios (Perlu Restock Segera) */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900">
                Perhatian Persediaan Kios
              </h2>
              {urgentStockItems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  {urgentStockItems.length} Perlu Restock
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Komoditas dengan persediaan menipis (di bawah batas 20 unit) atau telah habis dari etalase
            </p>
          </div>
          <Link href="/seller/inventory">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 h-8 font-medium self-start sm:self-auto"
            >
              Buka Inventaris Stok
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <Skeleton className="h-44 rounded-xl" />
        ) : urgentStockItems.length === 0 ? (
          <div className="p-6 sm:p-8 rounded-xl border border-neutral-200/90 bg-white text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <p className="text-sm font-semibold text-neutral-800">
              Semua Persediaan Mencukupi
            </p>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              Tidak ada komoditas dengan stok di bawah batas minimal (20 unit). Seluruh persediaan barang dagangan di etalase siap dipesan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50/90 border-b border-neutral-200/90 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Komoditas</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga Jual</th>
                  <th className="py-3 px-4">Sisa Stok</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {urgentStockItems.map((item) => {
                  const isZero = item.stock === 0;
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/80 shrink-0">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                sizes="40px"
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-neutral-900 block text-sm">
                              {item.name}
                            </span>
                            <span className="text-xs text-neutral-400">
                              Min. pesan: {item.min_order} {item.unit}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-neutral-600">
                        {item.category?.name || "Komoditas Pasar"}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-neutral-900">
                        {item.formatted_price}
                        <span className="text-neutral-500 font-normal"> / {item.unit}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm font-bold ${
                            isZero ? "text-rose-700" : "text-amber-700"
                          }`}
                        >
                          {item.stock}
                        </span>
                        <span className="text-xs font-normal text-neutral-500 ml-1">
                          {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isZero ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/70">
                            Stok Habis
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/70">
                            Menipis
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href="/seller/inventory">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 h-8 px-3 rounded-md transition-colors font-medium"
                          >
                            Atur Stok
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Komoditas Terbaru & Sebaran Kategori Kios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Kolom Kiri: Komoditas Terbaru */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Komoditas Terbaru
              </h2>
              <p className="text-xs text-neutral-500">
                Produk yang terakhir didaftarkan atau diperbarui di kios
              </p>
            </div>
            <Link
              href="/seller/products"
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Lihat semua komoditas &rarr;
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="p-8 rounded-xl border border-neutral-200/90 bg-white text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <p className="text-sm font-semibold text-neutral-800 mb-1">
                Belum Ada Komoditas di Kios
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
                Daftarkan komoditas dagangan pertama kios Anda untuk mulai berjualan bahan pangan di MARMA.
              </p>
              <Link href="/seller/products">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-medium">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Tambah Komoditas Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200/90 divide-y divide-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/80 shrink-0">
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          sizes="44px"
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 text-sm truncate">
                          {p.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.is_available ? "bg-emerald-600" : "bg-neutral-400"
                            }`}
                          />
                          {p.is_available ? "Aktif" : "Nonaktif"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {p.category?.name || "Komoditas"} &bull;{" "}
                        <span className="font-semibold text-neutral-800">
                          {p.formatted_price}
                        </span>{" "}
                        / {p.unit} &bull; Sisa stok: {p.stock}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                      title="Lihat halaman komoditas di katalog"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Sebaran Kategori Kios */}
        <div className="space-y-3.5">
          <div>
            <h2 className="text-base font-bold text-neutral-900">
              Sebaran Kategori Kios
            </h2>
            <p className="text-xs text-neutral-500">
              Proporsi komoditas terdaftar berdasarkan kategori pasar
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200/90 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : categoryDistribution.length === 0 ? (
              <p className="text-xs text-neutral-500">
                Belum ada komoditas aktif pada kategori kios.
              </p>
            ) : (
              <>
                <div className="space-y-3.5">
                  {categoryDistribution.map(({ category: cat, count }) => {
                    const percentage =
                      products.length > 0
                        ? Math.round((count / products.length) * 100)
                        : 0;
                    return (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-neutral-800">
                            {cat.name}
                          </span>
                          <span className="text-neutral-500 font-medium">
                            {count} jenis ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <Link
                    href="/seller/products"
                    className="block text-center text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    Kelola Komoditas &rarr;
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
