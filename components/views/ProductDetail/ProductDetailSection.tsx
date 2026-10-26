"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import product from "@/services/product.service";
import cart from "@/services/cart.service";
import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  Store,
  MapPin,
  Package,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ProductDetailSection({ slug }: { slug: string }) {
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState<number>(1);

  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await product.getProductBySlug(slug);
      const data = res.data.data;
      if (data?.min_order) {
        setQuantity(data.min_order);
      }
      return data;
    },
  });

  const { mutate: handleAddToCart, isPending: isAddingToCart } = useMutation({
    mutationFn: () =>
      cart.addToCart({
        product_id: productData!.id,
        quantity,
      }),
    onSuccess: () => {
      toast.success(
        `${quantity} ${productData?.unit || "item"} ${productData?.name} berhasil masuk keranjang`,
        { position: "top-right" }
      );
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      if (err?.response?.status === 401) {
        toast.error("Silakan masuk terlebih dahulu untuk belanja", {
          position: "top-right",
        });
      } else {
        toast.error(err?.response?.data?.message || err?.message || "Gagal menambahkan ke keranjang", {
          position: "top-right",
        });
      }
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-8 px-4">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96 rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isError || !productData) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 border rounded-xl bg-card">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-xl font-bold">Produk Tidak Ditemukan</h1>
          <p className="text-sm text-muted-foreground">
            Komoditas ini mungkin telah dinonaktifkan atau dihapus oleh penjual.
          </p>
          <Button nativeButton={false} render={<Link href="/" />}>
            Kembali ke Katalog
          </Button>
        </div>
      </MainLayout>
    );
  }

  const minOrder = productData.min_order || 1;
  const stock = productData.stock || 0;
  const isAvailable = productData.is_available && stock > 0;
  const store = productData.seller?.profile;

  const handleDecrease = () => {
    if (quantity > minOrder) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Gambar Produk */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden border bg-muted">
            <Image
              src={productData.image_url || "/test.jpg"}
              alt={productData.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
            />
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-destructive text-destructive-foreground px-4 py-1.5 rounded-md font-semibold text-sm">
                  Stok Habis / Tidak Tersedia
                </span>
              </div>
            )}
          </div>

          {/* Info Produk */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {productData.category && (
                <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {productData.category.name}
                </span>
              )}

              <h1 className="text-2xl lg:text-3xl font-bold">
                {productData.name}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-primary">
                  {productData.formatted_price}
                </span>
                <span className="text-muted-foreground text-sm">
                  / {productData.unit}
                </span>
              </div>

              {/* Info Kios / Penjual */}
              <div className="p-4 rounded-lg border bg-muted/40 space-y-2 text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <Store className="w-4 h-4 text-primary" />
                  <span>{store?.store_name || productData.seller?.name || "Kios Pasar"}</span>
                </div>
                {store?.market_name && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {store.market_name} {store.block_number ? `(${store.block_number})` : ""}
                    </span>
                  </div>
                )}
                {store?.full_address && (
                  <p className="text-xs text-muted-foreground pl-5">
                    {store.full_address}
                  </p>
                )}
              </div>

              {/* Deskripsi */}
              <div className="space-y-1">
                <h3 className="font-semibold text-sm">Deskripsi Komoditas</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {productData.description || "Tidak ada deskripsi rinci untuk produk ini."}
                </p>
              </div>

              {/* Rincian Stok & Min Order */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-md border">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground block">Sisa Stok</span>
                    <span className="font-semibold">{stock} {productData.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-md border">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground block">Minimal Pesan</span>
                    <span className="font-semibold">{minOrder} {productData.unit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aksi Tambah ke Keranjang */}
            <div className="border-t pt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Jumlah Pembelian:</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handleDecrease}
                    disabled={quantity <= minOrder || !isAvailable}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-bold text-base min-w-8 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={handleIncrease}
                    disabled={quantity >= stock || !isAvailable}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {productData.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between font-medium text-sm">
                <span>Subtotal:</span>
                <span className="text-lg font-bold text-primary">
                  Rp {(productData.price * quantity).toLocaleString("id-ID")}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full text-base flex items-center justify-center gap-2"
                disabled={!isAvailable || isAddingToCart}
                onClick={() => handleAddToCart()}
              >
                {isAddingToCart ? (
                  <Spinner />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Tambah ke Keranjang
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
