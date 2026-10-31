"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import product, { IProductQueryParams } from "@/services/product.service";
import category from "@/services/category.service";

export const useAdminProductCatalog = (initialCategorySlug?: string) => {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || "all"
  );
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  // 1. Fetch data produk master
  const {
    data: productResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: [
      "admin",
      "product-catalog",
      search,
      selectedCategory,
      page,
    ],
    queryFn: async () => {
      const params: IProductQueryParams = {
        page,
        per_page: 15,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== "all") params.category = selectedCategory;

      const res = await product.getProducts(params);
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 2. Fetch master kategori untuk dropdown filter
  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await category.getCategories();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const categories = categoriesResponse?.data || [];
  const rawProducts = productResponse?.data || [];
  const meta = productResponse?.meta;

  // Filter ketersediaan di sisi client
  const filteredProducts = rawProducts.filter((p) => {
    if (availabilityFilter === "available") {
      return p.is_available && p.stock > 0;
    }
    if (availabilityFilter === "out_of_stock") {
      return !p.is_available || p.stock === 0;
    }
    return true;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const totalProductsCount = meta?.total || rawProducts.length;

  return {
    products: filteredProducts,
    categories,
    meta,
    totalProductsCount,
    search,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    selectedCategory,
    setSelectedCategory: (cat: string) => {
      setSelectedCategory(cat);
      setPage(1);
    },
    availabilityFilter,
    setAvailabilityFilter: (st: string) => {
      setAvailabilityFilter(st);
    },
    page,
    setPage,
    isProductsLoading,
    isProductsError,
    refetchProducts,
  };
};
