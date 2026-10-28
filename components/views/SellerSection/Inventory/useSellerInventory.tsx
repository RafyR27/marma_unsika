"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import product from "@/services/product.service";
import category from "@/services/category.service";
import { IProduct, IUpdateProductRequest } from "@/types/product";

export type StockFilterType = "all" | "low" | "out" | "available";

export const useSellerInventory = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilterType>("all");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
  
  // Modal Adjust Stock State
  const [adjustingProduct, setAdjustingProduct] = useState<IProduct | null>(null);

  // 1. Fetch seluruh produk seller
  const {
    data: productsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["seller-inventory"],
    queryFn: async () => {
      // Ambil hingga 100 produk kios untuk manajemen inventaris
      const res = await product.getSellerProducts({ per_page: 100 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 2. Fetch kategori untuk filter
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await category.getCategories();
      return res.data.data;
    },
  });

  const rawProducts: IProduct[] = useMemo(
    () => productsResponse?.data ?? [],
    [productsResponse?.data]
  );

  // 3. Ringkasan Statistik Inventaris (Inventory Summary)
  const stats = useMemo(() => {
    const total = rawProducts.length;
    const outOfStock = rawProducts.filter(
      (p) => p.stock === 0 || !p.is_available
    ).length;
    // Stok menipis jika stok > 0 tapi <= 20 atau <= min_order * 2
    const lowStock = rawProducts.filter(
      (p) => p.is_available && p.stock > 0 && p.stock <= Math.max(20, (p.min_order || 1) * 2)
    ).length;
    const healthyStock = rawProducts.filter(
      (p) => p.is_available && p.stock > Math.max(20, (p.min_order || 1) * 2)
    ).length;

    return { total, healthyStock, lowStock, outOfStock };
  }, [rawProducts]);

  // 4. Filter Produk di sisi client
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((p) => {
      // Filter Nama
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Filter Kategori
      if (selectedCategoryId !== "all" && p.category_id !== selectedCategoryId) {
        return false;
      }

      // Filter Status Stok
      const isLow = p.is_available && p.stock > 0 && p.stock <= Math.max(20, (p.min_order || 1) * 2);
      const isOut = p.stock === 0 || !p.is_available;

      if (stockFilter === "low") return isLow;
      if (stockFilter === "out") return isOut;
      if (stockFilter === "available") return p.is_available && p.stock > 0;

      return true;
    });
  }, [rawProducts, search, selectedCategoryId, stockFilter]);

  // 5. Mutasi Update Stok / Status Produk
  const { mutate: updateInventory, isPending: isUpdating } = useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: IUpdateProductRequest;
    }) => product.updateProduct(slug, payload),
    onSuccess: () => {
      toast.success("Inventaris komoditas berhasil diperbarui!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["seller-inventory"] });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setAdjustingProduct(null);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error?.response?.data?.message || "Gagal memperbarui inventaris.", {
        position: "top-right",
      });
    },
  });

  // 6. Quick Toggle Etalase (Buka / Tutup Etalase Cepat)
  const toggleAvailability = (p: IProduct) => {
    updateInventory({
      slug: p.slug,
      payload: {
        is_available: !p.is_available,
      },
    });
  };

  return {
    rawProducts,
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
  };
};