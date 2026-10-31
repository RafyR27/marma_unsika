"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import category from "@/services/category.service";

export const useAdminCategories = () => {
  const [search, setSearch] = useState("");

  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await category.getCategories();
      return response.data.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalCommodities = categories.reduce(
    (sum, c) => sum + (c.products_count || 0),
    0
  );

  return {
    categories: filteredCategories,
    rawCategoriesCount: categories.length,
    totalCommodities,
    search,
    setSearch,
    isLoading,
    isError,
    refetch,
  };
};
