"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import review from "@/services/review.service";

export interface IReviewItem {
  id: string | number;
  buyerName: string;
  storeName: string;
  rating: number;
  commodityName: string;
  date: string;
  comment: string;
  tags: string[];
}

export const initialReviews: IReviewItem[] = [];

export const useSellerReviews = () => {
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  const {
    data: remoteReviews,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["seller", "reviews"],
    queryFn: async () => {
      const res = await review.getSellerReviews();
      return res.data?.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // Petakan respons API atau fallback ke initialReviews
  const reviews: IReviewItem[] =
    remoteReviews && remoteReviews.length > 0
      ? remoteReviews.map((r) => ({
          id: r.id,
          buyerName: r.buyer?.name || "Pembeli Terverifikasi",
          storeName: r.buyer?.profile?.store_name || "Warung Pelanggan",
          rating: r.rating,
          commodityName: r.product?.name || "Komoditas Grosir",
          date: r.created_at
            ? new Date(r.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Hari ini",
          comment: r.comment,
          tags: r.tags || ["Kualitas Terjamin"],
        }))
      : initialReviews;

  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter === "all") return true;
    return r.rating === ratingFilter;
  });

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";

  return {
    reviews: filteredReviews,
    totalReviews: reviews.length,
    averageRating,
    ratingFilter,
    setRatingFilter,
    isLoading,
    refetch,
  };
};
