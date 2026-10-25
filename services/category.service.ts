import instance from "@/lib/instance";
import { ICategoryListResponse } from "@/types/category";

const category = {
  getCategories: () => instance.get<ICategoryListResponse>("/categories"),
  categories: () => instance.get<ICategoryListResponse>("/categories"),
};

export default category;
