"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import category from "@/services/category.service";
import { ICreateCategoryPayload } from "@/types/category";

export const useAdminCategories = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  // Modal & Form State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    image_url?: string;
  }>({});

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

  const resetCreateForm = () => {
    setCategoryName("");
    setImageUrl("");
    setFormErrors({});
  };

  const { mutate: executeCreateCategory, isPending: isCreatingCategory } =
    useMutation({
      mutationFn: async (payload: ICreateCategoryPayload) => {
        // Coba endpoint admin/categories terlebih dahulu, fallback ke /categories jika 404
        try {
          const res = await category.createAdminCategory(payload);
          return res.data;
        } catch (err: unknown) {
          const axiosErr = err as AxiosError;
          if (axiosErr?.response?.status === 404) {
            const fallbackRes = await category.createCategory(payload);
            return fallbackRes.data;
          }
          throw err;
        }
      },
      onSuccess: (data) => {
        toast.success(data?.message || "Kategori komoditas berhasil ditambahkan.", {
          position: "top-right",
        });
        resetCreateForm();
        setIsCreateModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: (error: unknown) => {
        const err = error as AxiosError<{
          message?: string;
          errors?: Record<string, string[]>;
        }>;
        const resData = err?.response?.data;

        if (resData?.errors) {
          const formattedErrors: { name?: string; image_url?: string } = {};
          if (resData.errors.name) {
            formattedErrors.name = resData.errors.name[0];
          }
          if (resData.errors.image_url) {
            formattedErrors.image_url = resData.errors.image_url[0];
          }
          setFormErrors(formattedErrors);

          const firstKey = Object.keys(resData.errors)[0];
          const firstMsg = resData.errors[firstKey]?.[0] || resData.message;
          toast.error(firstMsg, { position: "top-right" });
        } else {
          toast.error(
            resData?.message ||
              err.message ||
              "Gagal menambahkan kategori komoditas.",
            { position: "top-right" }
          );
        }
      },
    });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors: { name?: string; image_url?: string } = {};
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      errors.name = "Nama kategori wajib diisi.";
    } else if (trimmedName.length < 3) {
      errors.name = "Nama kategori minimal 3 karakter.";
    }

    if (imageUrl.trim()) {
      try {
        const url = new URL(imageUrl.trim());
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          errors.image_url = "URL gambar harus menggunakan protokol http atau https.";
        }
      } catch {
        if (!imageUrl.startsWith("/")) {
          errors.image_url = "Format URL gambar tidak valid.";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    executeCreateCategory({
      name: trimmedName,
      image_url: imageUrl.trim() || null,
    });
  };

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
    // Create Category Modal & Form
    isCreateModalOpen,
    setIsCreateModalOpen: (open: boolean) => {
      setIsCreateModalOpen(open);
      if (!open) resetCreateForm();
    },
    categoryName,
    setCategoryName,
    imageUrl,
    setImageUrl,
    formErrors,
    handleCreateCategory,
    isCreatingCategory,
    resetCreateForm,
  };
};
