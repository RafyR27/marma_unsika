import instance from "@/lib/instance";
import {
  ICategoryListResponse,
  ICreateCategoryRequest,
  ISingleCategoryResponse,
  IUpdateCategoryRequest,
} from "@/types/category";

const category = {
  // Ambil seluruh master kategori komoditas pasar (Public)
  getCategories: () => instance.get<ICategoryListResponse>("/categories"),
  categories: () => instance.get<ICategoryListResponse>("/categories"),

  // Ambil detail satu kategori berdasarkan slug
  getCategoryBySlug: (slug: string) =>
    instance.get<ISingleCategoryResponse>(`/categories/${slug}`),

  // Admin: Tambah kategori komoditas pasar baru
  createCategory: (payload: ICreateCategoryRequest | FormData) =>
    instance.post<ISingleCategoryResponse>("/categories", payload, {
      headers:
        payload instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }),

  // Admin: Ubah nama atau gambar kategori komoditas pasar
  updateCategory: (
    idOrSlug: number | string,
    payload: IUpdateCategoryRequest | FormData
  ) =>
    instance.put<ISingleCategoryResponse>(`/categories/${idOrSlug}`, payload, {
      headers:
        payload instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }),

  // Admin: Hapus kategori komoditas pasar
  deleteCategory: (idOrSlug: number | string) =>
    instance.delete<{ message: string }>(`/categories/${idOrSlug}`),
};

export default category;
