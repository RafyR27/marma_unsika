import instance from "@/lib/instance";
import {
  ICategoryListResponse,
  ICreateCategoryPayload,
  ICategorySingleResponse,
} from "@/types/category";

const category = {
  getCategories: () => instance.get<ICategoryListResponse>("/categories"),
  categories: () => instance.get<ICategoryListResponse>("/categories"),
  createCategory: (payload: ICreateCategoryPayload) =>
    instance.post<ICategorySingleResponse>("/categories", payload),
  createAdminCategory: (payload: ICreateCategoryPayload) =>
    instance.post<ICategorySingleResponse>("/admin/categories", payload),
};

export default category;
