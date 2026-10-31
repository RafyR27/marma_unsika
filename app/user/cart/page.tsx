"use client";

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

  const { mutate: updateQuantity, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cart.updateCartItem(id, { quantity }),
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
    mutationFn: (id: number) => cart.deleteCartItem(id),
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

  const hasToken =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-primary" />
              Keranjang Belanja
            </h1>
          </div>

          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => clearAll()}
              disabled={isClearing}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {isClearing ? <Spinner /> : <Trash2 className="w-4 h-4 mr-1.5" />}
              Kosongkan Keranjang
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
            <Button variant="outline" size="sm" onClick={() => refetch()}>
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

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl bg-card gap-4"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <Image
                          src={p?.image_url || "/test.jpg"}
                          alt={p?.name || "Produk"}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                          <Store className="w-3 h-3 shrink-0" />
                          <span className="truncate">{storeName}</span>
                        </p>
                        <Link href={`/products/${p?.slug}`}>
                          <h3 className="font-semibold text-sm hover:text-primary transition-colors truncate">
                            {p?.name}
                          </h3>
                        </Link>
                        <p className="text-xs font-semibold text-primary">
                          {p?.formatted_price}{" "}
                          <span className="text-muted-foreground font-normal">
                            / {p?.unit}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => {
                            if (item.quantity > minOrder) {
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity - 1,
                              });
                            }
                          }}
                          disabled={item.quantity <= minOrder || isUpdating}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-bold text-sm min-w-7 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => {
                            if (item.quantity < stock) {
                              updateQuantity({
                                id: item.id,
                                quantity: item.quantity + 1,
                              });
                            }
                          }}
                          disabled={item.quantity >= stock || isUpdating}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground ml-1">
                          {p?.unit}
                        </span>
                      </div>

                      <div className="text-right min-w-24">
                        <p className="font-bold text-sm text-primary">
                          {item.formatted_subtotal ||
                            `Rp ${(item.quantity * (p?.price || 0)).toLocaleString("id-ID")}`}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                        disabled={isDeleting}
                        title="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
