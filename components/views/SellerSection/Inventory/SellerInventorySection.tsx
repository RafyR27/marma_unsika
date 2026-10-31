"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMe } from "@/hooks/useMe";
import { useSellerInventory, StockFilterType } from "./useSellerInventory";
import { IProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit2,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Plus,
  ExternalLink,
  ShieldAlert,
  Archive,
} from "lucide-react";

const emptySubscribe = () => () => {};

export default function SellerInventorySection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const {
    filteredProducts,
    categories,
    stats,
    isLoading,
    isError,
    refetch,
    search,
    setSearch,
    stockFilter,
    setStockFilter,
    selectedCategoryId,
    setSelectedCategoryId,
    adjustingProduct,
    setAdjustingProduct,
    updateInventory,
    isUpdating,
    toggleAvailability,
  } = useSellerInventory();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
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
          Halaman inventaris dan kesegaran stok hanya dapat diakses oleh mitra Seller terdaftar.
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
            Stok & Kesegaran Komoditas
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau sisa kuantitas barang dagangan kios dan sesuaikan ketersediaan etalase pasar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
          <Link href="/seller/products">
            <Button size="sm" className="flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Tambah Produk
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Kartu Metrik Inventaris */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Komoditas */}
        <div
          onClick={() => setStockFilter("all")}
          className={`p-4 rounded-xl border bg-card cursor-pointer transition-all ${
            stockFilter === "all" ? "ring-2 ring-primary border-primary shadow-xs" : "hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Komoditas</span>
            <Archive className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
          <span className="text-[11px] text-muted-foreground">Terdaftar di kios</span>
        </div>

        {/* Stok Aman */}
        <div
          onClick={() => setStockFilter("available")}
          className={`p-4 rounded-xl border bg-card cursor-pointer transition-all ${
            stockFilter === "available" ? "ring-2 ring-emerald-500 border-emerald-500 shadow-xs" : "hover:border-emerald-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Stok Aman & Segar</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold mt-2 text-emerald-600">{stats.healthyStock}</p>
          <span className="text-[11px] text-muted-foreground">Siap dipesan pembeli</span>
        </div>

        {/* Stok Menipis */}
        <div
          onClick={() => setStockFilter("low")}
          className={`p-4 rounded-xl border bg-card cursor-pointer transition-all ${
            stockFilter === "low" ? "ring-2 ring-amber-500 border-amber-500 shadow-xs" : "hover:border-amber-500/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Stok Menipis</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-2 text-amber-500">{stats.lowStock}</p>
          <span className="text-[11px] text-muted-foreground">Perlu restok kulakan</span>
        </div>

        {/* Stok Habis / Nonaktif */}
        <div
          onClick={() => setStockFilter("out")}
          className={`p-4 rounded-xl border bg-card cursor-pointer transition-all ${
            stockFilter === "out" ? "ring-2 ring-destructive border-destructive shadow-xs" : "hover:border-destructive/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Habis / Disembunyikan</span>
            <XCircle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold mt-2 text-destructive">{stats.outOfStock}</p>
          <span className="text-[11px] text-muted-foreground">Tidak tampil di katalog</span>
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 border rounded-xl bg-card">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari nama cabai, bawang, sayuran..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Dropdown Kategori */}
          <select
            value={selectedCategoryId}
            onChange={(e) =>
              setSelectedCategoryId(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="h-9 px-3 rounded-lg border border-input bg-background text-xs outline-none focus:border-ring cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Filter Status Tombol Cepat */}
          <div className="inline-flex rounded-lg border p-0.5 bg-muted/40 text-xs">
            {(
              [
                { key: "all", label: "Semua" },
                { key: "available", label: "Aman" },
                { key: "low", label: "Menipis" },
                { key: "out", label: "Habis" },
              ] as { key: StockFilterType; label: string }[]
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setStockFilter(item.key)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  stockFilter === item.key
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabel Data Inventaris */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil data inventaris produk.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-4 bg-muted/20">
          <Boxes className="w-16 h-16 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-lg">Tidak Ada Komoditas Ditemukan</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {search || stockFilter !== "all" || selectedCategoryId !== "all"
              ? "Tidak ada produk yang sesuai dengan kriteria filter saat ini."
              : "Belum ada produk terdaftar di kios Anda."}
          </p>
          {(search || stockFilter !== "all" || selectedCategoryId !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setStockFilter("all");
                setSelectedCategoryId("all");
              }}
            >
              Reset Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-muted-foreground border-b text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Komoditas Pasar</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Sisa Stok Fisik</th>
                  <th className="py-3.5 px-4">Min. Pembelian</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((p) => {
                  const isLow = p.is_available && p.stock > 0 && p.stock <= Math.max(20, (p.min_order || 1) * 2);

                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      {/* Nama & Foto Produk */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0 border">
                            <Image
                              src={p.image_url || "/test.jpg"}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <Link
                              href={`/products/${p.slug}`}
                              className="font-medium hover:text-primary transition-colors flex items-center gap-1 group"
                            >
                              <span>{p.name}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <span className="text-xs font-semibold text-primary block mt-0.5">
                              {p.formatted_price}{" "}
                              <span className="text-muted-foreground font-normal">
                                / {p.unit}
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kategori */}
                      <td className="py-3.5 px-4 text-xs">
                        <span className="bg-muted px-2.5 py-1 rounded-md text-muted-foreground font-medium">
                          {p.category?.name || "Umum"}
                        </span>
                      </td>

                      {/* Sisa Stok dengan Indikator Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base">{p.stock}</span>
                          <span className="text-xs text-muted-foreground">{p.unit}</span>
                          {p.stock === 0 ? (
                            <span className="text-[10px] bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-semibold">
                              Habis
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-semibold">
                              Menipis
                            </span>
                          ) : (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-semibold">
                              Segar/Aman
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Min. Pembelian */}
                      <td className="py-3.5 px-4 text-xs font-medium text-muted-foreground">
                        {p.min_order} {p.unit}
                      </td>

                      {/* Status Etalase */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(p)}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors border ${
                            p.is_available
                              ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-500/20"
                              : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
                          }`}
                          title="Klik untuk mengubah visibilitas etalase"
                        >
                          <span
                            className={`size-2 rounded-full ${
                              p.is_available ? "bg-green-500" : "bg-muted-foreground"
                            }`}
                          />
                          {p.is_available ? "Tersedia" : "Disembunyikan"}
                        </button>
                      </td>

                      {/* Aksi Cepat */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAdjustingProduct(p)}
                          className="flex items-center gap-1.5 ml-auto text-xs font-medium"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          Sesuaikan Stok
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: PENYESUAIAN STOK CEPAT */}
      {adjustingProduct && (
        <StockAdjustmentDialog
          key={adjustingProduct.id}
          product={adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          onSave={(payload) => {
            updateInventory({
              slug: adjustingProduct.slug,
              payload,
            });
          }}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}

interface StockAdjustmentDialogProps {
  product: IProduct;
  onClose: () => void;
  onSave: (payload: { stock: number; is_available: boolean }) => void;
  isUpdating: boolean;
}

function StockAdjustmentDialog({
  product,
  onClose,
  onSave,
  isUpdating,
}: StockAdjustmentDialogProps) {
  const [adjustmentMode, setAdjustmentMode] = useState<"add" | "set">("add");
  const [addQty, setAddQty] = useState<number>(10);
  const [newStock, setNewStock] = useState<number>(product.stock);
  const [isAvailableInModal, setIsAvailableInModal] = useState<boolean>(
    product.is_available
  );

  const handleSave = () => {
    let finalStock = newStock;
    if (adjustmentMode === "add") {
      finalStock = Math.max(0, product.stock + addQty);
    } else {
      finalStock = Math.max(0, newStock);
    }

    onSave({
      stock: finalStock,
      is_available: isAvailableInModal,
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pr-8">
          <DialogTitle className="flex items-center gap-2 text-base leading-snug">
            <Edit2 className="w-5 h-5 text-primary" />
            Kelola Stok: {product.name}
          </DialogTitle>
          <DialogDescription>
            Perbarui jumlah stok fisik yang tersedia di lapak atau sembunyikan sementara dari pembeli.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Info Singkat Komoditas */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Stok Saat Ini:</span>
              <span className="font-bold text-lg text-primary">
                {product.stock} {product.unit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Harga Grosir:</span>
              <span className="font-semibold">{product.formatted_price}</span>
            </div>
          </div>

          {/* Pilihan Mode Penyesuaian */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              Metode Penyesuaian
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentMode("add")}
                className={`p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  adjustmentMode === "add"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Pasokan Baru
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentMode("set")}
                className={`p-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  adjustmentMode === "set"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Input Stok Baru
              </button>
            </div>
          </div>

          {/* Input Kuantitas Sesuai Mode */}
          {adjustmentMode === "add" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Jumlah Pasokan Masuk ({product.unit})
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={addQty}
                  onChange={(e) => setAddQty(Math.max(1, Number(e.target.value)))}
                  className="h-10 text-base font-bold"
                />
                <div className="flex gap-1">
                  {[10, 25, 50, 100].map((amt) => (
                    <Button
                      key={amt}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAddQty(amt)}
                      className="text-xs font-medium"
                    >
                      +{amt}
                    </Button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Stok akhir kios akan menjadi:{" "}
                <strong className="text-primary font-bold">
                  {product.stock + (addQty || 0)} {product.unit}
                </strong>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Atur Total Stok Fisik Baru ({product.unit})
              </label>
              <Input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(Math.max(0, Number(e.target.value)))}
                className="h-10 text-base font-bold"
              />
              <p className="text-xs text-muted-foreground">
                Kuantitas stok langsung diubah ke angka ini.
              </p>
            </div>
          )}

          {/* Toggle Status Etalase */}
          <div className="pt-2 border-t flex items-center justify-between">
            <div>
              <span className="text-sm font-medium block">Tampilkan di Etalase</span>
              <span className="text-xs text-muted-foreground block">
                Pembeli dapat melihat dan memasukkan ke keranjang
              </span>
            </div>
            <input
              type="checkbox"
              id="modal-available"
              checked={isAvailableInModal}
              onChange={(e) => setIsAvailableInModal(e.target.checked)}
              className="w-4 h-4 rounded text-primary cursor-pointer"
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUpdating}
            onClick={onClose}
          >
            Batal
          </Button>
          <Button
            type="button"
            disabled={isUpdating}
            onClick={handleSave}
            className="flex items-center gap-1.5"
          >
            {isUpdating ? <Spinner /> : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}