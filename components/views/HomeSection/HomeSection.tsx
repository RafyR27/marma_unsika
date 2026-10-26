"use client";

import { useState } from "react";
import { Banner } from "@/components/common/banner";
import { Kategori } from "@/components/common/kategori";
import { ProductCard } from "@/components/common/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { Suspense } from "react";
import { useHome } from "./useHome";

export default function HomeSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    products,
    isLoadingProducts,
    isErrorProducts,
    refetchProducts,
  } = useHome(selectedCategory ? { category: selectedCategory } : undefined);

  return (
    <>
      <Suspense fallback={null}>
        <Banner />
      </Suspense>

      <Kategori
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Filter Info Bar */}
      {selectedCategory && (
        <div className="flex items-center gap-2 mb-4 p-2.5 bg-muted rounded-md text-sm">
          <span>Menampilkan produk kategori: <strong className="text-primary">{selectedCategory}</strong></span>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setSelectedCategory(null)}
            className="ml-auto flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
            Reset Filter
          </Button>
        </div>
      )}

      {/* Error State */}
      {isErrorProducts && (
        <div className="w-full p-6 my-12 rounded-lg flex flex-col items-center justify-center text-center gap-3 border border-destructive/20 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive" />
          <p className="text-sm text-destructive font-medium">
            Gagal memuat produk dari server. Pastikan API backend aktif.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchProducts()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoadingProducts && (
        <div className="w-full grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="w-full min-h-55 border rounded-md p-3 flex flex-col justify-between gap-3 bg-card"
            >
              <Skeleton className="w-full h-40 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="w-1/3 h-3" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-1/2 h-5" />
                <Skeleton className="w-full h-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product List */}
      {!isLoadingProducts && !isErrorProducts && (
        <>
          {products.length === 0 ? (
            <div className="w-full p-12 border rounded-md text-center text-muted-foreground bg-muted/20 my-6">
              <p className="font-medium">Belum ada komoditas di kategori ini.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Kios pedagang pasar sedang memperbarui etalase produk mereka.
              </p>
            </div>
          ) : (
            <div className="w-full grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-3">
              {products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
