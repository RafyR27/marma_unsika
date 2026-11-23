"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import cart from "@/services/cart.service";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Store,
  ShoppingBag,
  AlertTriangle,
} from "lucide-react";

export default function CartPage() {
  const queryClient = useQueryClient();

  const {
    data: cartData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cart.getCart();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { mutate: updateQuantity, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => {
      setUpdatingId(id);
      return cart.updateCartItem(id, { quantity });
    },
    onSettled: () => {
      setUpdatingId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err?.response?.data?.message || err?.message || "Gagal mengubah jumlah item", {
        position: "top-right",
      });
    },
  });

  const { mutate: removeItem, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => {
      setDeletingId(id);
      return cart.deleteCartItem(id);
    },
    onSettled: () => {
      setDeletingId(null);
    },
    onSuccess: () => {
      toast.success("Item dihapus dari keranjang", { position: "top-right" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err?.response?.data?.message || err?.message || "Gagal menghapus item", {
        position: "top-right",
      });
    },
  });

  const { mutate: clearAll, isPending: isClearing } = useMutation({
    mutationFn: () => cart.clearCart(),
    onSuccess: () => {
      toast.success("Keranjang belanja dikosongkan", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err?.response?.data?.message || err?.message || "Gagal mengosongkan keranjang", {
        position: "top-right",
      });
    },
  });

  const items = cartData?.data || [];
  const summary = cartData?.summary || {
    total_items: 0,
    total_price: 0,
    formatted_total_price: "Rp 0",
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 space-y-4">
          <div className="flex items-center justify-between pb-3 sm:pb-5 border-b border-border/60">
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl" />
              <Skeleton className="h-6 sm:h-8 w-36 sm:w-48 rounded-md" />
            </div>
            <Skeleton className="h-8 sm:h-9 w-20 sm:w-36 rounded-md" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  const hasToken =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4">
        {/* Top Header Section */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-5 border-b border-border/60">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center shrink-0 transition-colors shadow-xs active:scale-95"
              aria-label="Kembali ke beranda"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold flex items-center gap-1.5 sm:gap-2 text-foreground truncate tracking-tight">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary shrink-0" />
                <span className="truncate">Keranjang Belanja</span>
              </h1>
              {items.length > 0 && (
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {summary.total_items} item
                </span>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearAll()}
              disabled={isClearing}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/40 h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm font-medium shrink-0 cursor-pointer"
            >
              {isClearing ? (
                <Spinner className="w-3.5 h-3.5" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              )}
              <span className="hidden sm:inline">Kosongkan Keranjang</span>
              <span className="inline sm:hidden">Kosongkan</span>
            </Button>
          )}
        </div>

        {!hasToken ? (
          <div className="text-center py-16 border rounded-xl bg-card space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
            <h2 className="text-lg font-semibold">Anda Belum Masuk</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Silakan masuk ke akun Anda untuk melihat atau menambahkan produk ke keranjang belanja.
            </p>
            <Button nativeButton={false} render={<Link href="/auth/login" className="px-6" />}>
              Masuk Sekarang
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 border rounded-xl bg-card space-y-4">
            <p className="text-destructive font-medium">
              Gagal memuat keranjang belanja.
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Coba Lagi
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 border rounded-xl bg-card space-y-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/60 mx-auto" />
            <h2 className="text-lg font-semibold">Keranjang Belanja Masih Kosong</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Jelajahi etalase komoditas pedagang pasar dan tambahkan kebutuhan kios Anda.
            </p>
            <Button nativeButton={false} render={<Link href="/" className="px-6" />}>
              Mulai Belanja
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Daftar Item Keranjang */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const p = item.product;
                const minOrder = p?.min_order || 1;
                const stock = p?.stock || 0;
                const storeName =
                  p?.seller?.profile?.store_name || p?.seller?.name || "Kios Pedagang";
                const isThisDeleting = isDeleting && deletingId === item.id;
                const isThisUpdating = isUpdating && updatingId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 border border-border rounded-2xl bg-card shadow-xs hover:border-primary/30 transition-all space-y-3.5"
                  >
                    {/* Header Toko & Tombol Hapus */}
                    <div className="flex items-center justify-between pb-3 border-b border-border/50 text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-foreground truncate min-w-0 pr-2">
                        <Store className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{storeName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                        title="Hapus item dari keranjang"
                      >
                        {isThisDeleting ? (
                          <Spinner className="w-3.5 h-3.5" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>

                    {/* Informasi Produk & Kontrol Kuantitas */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Produk */}
                      <div className="flex items-center gap-3.5 min-w-0 flex-1 w-full sm:w-auto">
                        <Link
                          href={`/products/${p?.slug}`}
                          className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-muted border border-border/40 block group"
                        >
                          <Image
                            src={p?.image_url || "/test.jpg"}
                            alt={p?.name || "Produk"}
                            fill
                            sizes="96px"
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            unoptimized
                          />
                        </Link>
                        <div className="space-y-1 min-w-0 flex-1">
                          <Link href={`/products/${p?.slug}`}>
                            <h3 className="font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug">
                              {p?.name}
                            </h3>
                          </Link>
                          <p className="text-xs sm:text-sm font-semibold text-primary">
                            {p?.formatted_price}{" "}
                            <span className="text-muted-foreground font-normal text-xs">
                              / {p?.unit}
                            </span>
                          </p>
                          {minOrder > 1 && (
                            <p className="text-[11px] text-muted-foreground">
                              Min. order {minOrder} {p?.unit}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Kontrol Stepper & Subtotal */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        {/* Stepper Jumlah */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex items-center border border-border rounded-lg bg-background p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity > minOrder) {
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity - 1,
                                  });
                                }
                              }}
                              disabled={item.quantity <= minOrder || isThisUpdating}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md hover:bg-muted text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                              aria-label="Kurangi jumlah"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 sm:w-10 text-center font-bold text-xs sm:text-sm select-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity < stock) {
                                  updateQuantity({
                                    id: item.id,
                                    quantity: item.quantity + 1,
                                  });
                                }
                              }}
                              disabled={item.quantity >= stock || isThisUpdating}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md hover:bg-muted text-foreground transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                              aria-label="Tambah jumlah"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium select-none">
                            {p?.unit}
                          </span>
                        </div>

                        {/* Subtotal Nominal */}
                        <div className="text-right sm:min-w-28 shrink-0">
                          <span className="text-[10px] text-muted-foreground block leading-none mb-1">
                            Subtotal
                          </span>
                          <p className="font-bold text-sm sm:text-base text-primary leading-tight">
                            {item.formatted_subtotal ||
                              `Rp ${(item.quantity * (p?.price || 0)).toLocaleString("id-ID")}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ringkasan Belanja */}
            <div className="lg:col-span-1">
              <div className="border rounded-xl p-5 bg-card space-y-4 sticky top-6">
                <h2 className="font-bold text-base">Ringkasan Pesanan</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Kuantitas:</span>
                    <span>{summary.total_items} item</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Ongkos Kirim:</span>
                    <span className="text-xs text-green-600 font-medium">
                      Dihitung saat checkout
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-base">
                    <span>Total Tagihan:</span>
                    <span className="text-primary">{summary.formatted_total_price}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full text-base font-semibold"
                  nativeButton={false}
                  render={<Link href="/user/checkout" />}
                >
                  Lanjut ke Checkout Pesanan
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  Barang diproses dan dikirim langsung dari pedagang Pasar Induk.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
