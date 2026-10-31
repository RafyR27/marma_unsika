"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  MessageSquare,
  ShieldAlert,
  ThumbsUp,
  CheckCircle2,
  Package,
  Store,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useSellerReviews } from "./useSellerReviews";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function SellerReviewsSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    reviews,
    totalReviews,
    averageRating,
    ratingFilter,
    setRatingFilter,
  } = useSellerReviews();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
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
          Ulasan dan kepuasan pembeli warung hanya dapat diakses oleh mitra pedagang pasar.
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
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            Ulasan & Kepuasan Pembeli Warung
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Evaluasi kualitas kesegaran komoditas lapak, ketepatan timbangan, dan kepuasan pedagang warung pembeli.
          </p>
        </div>
      </div>

      {/* 3 Kartu Metrik Kepuasan */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-amber-500/30 ring-1 ring-amber-500/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Rating Kepuasan Kios</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-foreground">{averageRating}</p>
            <span className="text-xs text-muted-foreground">/ 5.0 Bintang</span>
          </div>
          <span className="text-[11px] text-muted-foreground block">
            Berdasarkan seluruh transaksi diselesaikan
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total Ulasan Masuk</span>
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{totalReviews} Ulasan</p>
          <span className="text-[11px] text-muted-foreground block">
            Dari mitra warung pelanggan setia
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Indeks Kesegaran Komoditas</span>
            <ThumbsUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">100% Puas</p>
          <span className="text-[11px] text-muted-foreground block">
            Zero komplain pembusukan barang
          </span>
        </div>
      </div>

      {/* Filter Rating */}
      <div className="flex items-center gap-2 border-b pb-3 text-xs">
        <span className="font-semibold text-muted-foreground mr-1">Filter Bintang:</span>
        {[
          { key: "all", label: "Semua Ulasan" },
          { key: 5, label: "5 Bintang ★" },
          { key: 4, label: "4 Bintang ★" },
        ].map((tab) => (
          <button
            key={String(tab.key)}
            onClick={() => setRatingFilter(tab.key as number | "all")}
            className={`px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
              ratingFilter === tab.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daftar Kartu Ulasan */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="p-5 border rounded-xl bg-card shadow-xs space-y-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b text-xs">
              <div>
                <p className="font-bold text-sm text-foreground">{r.buyerName}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  {r.storeName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground">{r.date}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-xs text-primary flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                Komoditas: {r.commodityName}
              </span>
              <p className="text-xs text-foreground leading-relaxed italic">
                &quot;{r.comment}&quot;
              </p>
            </div>

            {/* Tag Penilaian */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {r.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
