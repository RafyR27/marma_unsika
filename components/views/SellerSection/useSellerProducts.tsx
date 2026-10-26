"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import product, { ISellerProductQueryParams } from "@/services/product.service";
import category from "@/services/category.service";
import {
  IProduct,
  IStoreProductRequest,
  IUpdateProductRequest,
} from "@/types/product";

export const useSellerProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);

  // 1. Fetch Seller Products
  const queryParams: ISellerProductQueryParams = {
    search: search || undefined,
    page,
    per_page: 10,
  };

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["seller-products", queryParams],
    queryFn: async () => {
      const res = await product.getSellerProducts(queryParams);
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  // 2. Fetch Categories for Form Dropdown
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await category.getCategories();
      return res.data.data;
    },
  });

  // 3. Create Product Mutation
  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationFn: (payload: IStoreProductRequest) => product.storeProduct(payload),
    onSuccess: () => {
      toast.success("Produk berhasil ditambahkan ke etalase kios!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsCreateOpen(false);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      const validationErrors = error?.response?.data?.errors;
      if (validationErrors) {
        const firstField = Object.keys(validationErrors)[0];
        toast.error(validationErrors[firstField][0], { position: "top-right" });
      } else {
        toast.error(error?.response?.data?.message || error?.message || "Gagal menambahkan produk.", {
          position: "top-right",
        });
      }
    },
  });

  // 4. Update Product Mutation
  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationFn: ({
      slug,
      payload,
    }: {
      slug: string;
      payload: IUpdateProductRequest;
    }) => product.updateProduct(slug, payload),
    onSuccess: () => {
      toast.success("Data produk berhasil diperbarui!", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      const validationErrors = error?.response?.data?.errors;
      if (validationErrors) {
        const firstField = Object.keys(validationErrors)[0];
        toast.error(validationErrors[firstField][0], { position: "top-right" });
      } else {
        toast.error(error?.response?.data?.message || error?.message || "Gagal memperbarui produk.", {
          position: "top-right",
        });
      }
    },
  });

  // 5. Delete Product Mutation
  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: (slug: string) => product.deleteProduct(slug),
    onSuccess: () => {
      toast.success("Produk berhasil dihapus dari kios.", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeletingProduct(null);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error?.response?.data?.message || error?.message || "Gagal menghapus produk.", {
        position: "top-right",
      });
    },
  });

  return {
    products: productsResponse?.data || [],
    pagination: {
      meta: productsResponse?.meta,
      links: productsResponse?.links,
    },
    categories,
    isLoadingCategories,
    isLoading,
    isError,
    error,
    refetch,
    search,
    setSearch,
    page,
    setPage,
    // Modals
    isCreateOpen,
    setIsCreateOpen,
    editingProduct,
    setEditingProduct,
    deletingProduct,
    setDeletingProduct,
    // Actions
    createProduct,
    isCreating,
    updateProduct,
    isUpdating,
    deleteProduct,
    isDeleting,
  };
};
