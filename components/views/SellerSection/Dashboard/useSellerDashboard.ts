"use client";

import { useQuery } from "@tanstack/react-query";
import product from "@/services/product.service";
import seller from "@/services/seller.service";
import { useMe } from "@/hooks/useMe";

export const useSellerDashboard = () => {
  const { data: user, isLoading: isUserLoading } = useMe();

  // 1. Ambil antrean kemas
  const {
    data: incomingData,
    isLoading: isIncomingLoading,
    refetch: refetchIncoming,
  } = useQuery({
    queryKey: ["seller", "incoming-items"],
    queryFn: async () => {
      const res = await seller.getIncomingItems();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 2. Ambil produk seller
  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useQuery({
    queryKey: ["seller", "products"],
    queryFn: async () => {
      const res = await product.getSellerProducts({ per_page: 50 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 3. Ambil total pesanan
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
  } = useQuery({
    queryKey: ["seller", "orders", "summary"],
    queryFn: async () => {
      const res = await seller.getSellerOrders({ per_page: 1 });
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const incomingItems = incomingData?.data || [];
  const products = productsData?.data || [];
  const totalOrders = ordersData?.meta?.total || 0;

  // Analisis stok
  const lowStockProducts = products.filter(
    (p) => p.is_available && p.stock <= Math.max(20, (p.min_order || 1) * 2)
  );

  return {
    user,
    isUserLoading,
    incomingItems,
    isIncomingLoading,
    refetchIncoming,
    products,
    isProductsLoading,
    totalOrders,
    isOrdersLoading,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
  };
};
