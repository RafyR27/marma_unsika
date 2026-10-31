"use client";

import { useState } from "react";

export interface IReviewItem {
  id: string;
  buyerName: string;
  storeName: string;
  rating: number;
  commodityName: string;
  date: string;
  comment: string;
  tags: string[];
}

export const initialReviews: IReviewItem[] = [
  {
    id: "REV-01",
    buyerName: "Bu Dewi Sri",
    storeName: "Kios Sayur Bu Dewi (Pasar Minggu)",
    rating: 5,
    commodityName: "Cabai Merah Keriting Super Grosir",
    date: "28 Okt 2026",
    comment:
      "Cabai merah sangat segar dan kering sempurna, tidak ada yang busuk saat sampai di warung. Pelanggan warung saya sangat puas. Langganan terus!",
    tags: ["Segar", "Timbangan Pas", "Kering Siap Simpan"],
  },
  {
    id: "REV-02",
    buyerName: "Pak Slamet Riyadi",
    storeName: "Warung Berkah Jaya (Tanjungpura)",
    rating: 5,
    commodityName: "Bawang Merah Brebes Karung 25kg",
    date: "27 Okt 2026",
    comment:
      "Bawang merah umbinya padat dan besar-besar. Pengemasan karung rapi dan aman selama dibawa kurir lapangan pasar.",
    tags: ["Kualitas Super", "Kemasan Rapi"],
  },
  {
    id: "REV-03",
    buyerName: "Ibu Hajah Maryam",
    storeName: "Toko Sembako Barokah",
    rating: 4,
    commodityName: "Cabai Rawit Merah Super",
    date: "25 Okt 2026",
    comment:
      "Pedasnya mantap dan kualitas bagus. Pengemasan cepat sebelum kurir subuh tiba. Pertahankan kesegarannya.",
    tags: ["Pedas Mantap", "Cepat Dikemas"],
  },
];

export const useSellerReviews = () => {
  const [reviews] = useState<IReviewItem[]>(initialReviews);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

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
  };
};
