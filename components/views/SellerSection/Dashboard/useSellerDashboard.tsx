"use client";

import { useQuery } from "@tanstack/react-query";
import product from "@/services/product.service";
import category from "@/services/category.service";
import { IProduct } from "@/types/product";
import { ICategory } from "@/types/category";

export interface IDashboardStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
  formattedInventoryValue: string;
}

export interface ICategoryProductCount {
  category: ICategory;
  count: number;
}

// Batas kuantitas minimum sebelum komoditas dianggap menipis
const LOW_STOCK_THRESHOLD = 20;

const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const useSellerDashboard = () => {
  // Ambil hingga 100 komoditas untuk kalkulasi agregat metrik kios di sisi client
  const {
    data: productsResponse,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["seller-products", { per_page: 100 }],
    queryFn: async () => {
      const res = await product.getSellerProducts({ per_page: 100 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await category.getCategories();
      return res.data;
    },
  });

  const products: IProduct[] = productsResponse?.data || [];
  const categories: ICategory[] = categoriesResponse?.data || [];

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_available).length;

  // Komoditas dianggap menipis jika stok di bawah ambang batas atau kurang dari 2x minimal order
  const lowStockProducts = products.filter(
    (p) =>
      p.is_available &&
      p.stock > 0 &&
      p.stock <= Math.max(LOW_STOCK_THRESHOLD, (p.min_order || 1) * 2)
  ).length;

  const outOfStockProducts = products.filter(
    (p) => p.stock === 0 || !p.is_available
  ).length;

  const totalInventoryValue = products.reduce(
    (acc, p) => acc + (p.price || 0) * (p.stock || 0),
    0
  );

  const stats: IDashboardStats = {
    totalProducts,
    activeProducts,
    lowStockProducts,
    outOfStockProducts,
    totalInventoryValue,
    formattedInventoryValue: formatRupiah(totalInventoryValue),
  };

  // Komoditas yang membutuhkan penambahan stok segera, diutamakan dari stok 0
  const urgentStockItems: IProduct[] = products
    .filter((p) => p.stock === 0 || p.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const recentProducts: IProduct[] = [...products]
    .sort(
      (a, b) =>
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
    )
    .slice(0, 5);

  const categoryDistribution: ICategoryProductCount[] = categories
    .map((cat) => ({
      category: cat,
      count: products.filter((p) => p.category_id === cat.id).length,
    }))
    .filter((item) => item.count > 0);

  const refetch = () => {
    refetchProducts();
    refetchCategories();
  };

  return {
    products,
    categories,
    stats,
    urgentStockItems,
    recentProducts,
    categoryDistribution,
    isLoading: isLoadingProducts || isLoadingCategories,
    isError: isProductsError || isCategoriesError,
    refetch,
  };
};
