interface ICategory {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface ICategoryListResponse {
  data: ICategory[];
}

interface ISingleCategoryResponse {
  message?: string;
  data: ICategory;
}

interface ICreateCategoryRequest {
  name: string;
  image_url?: string;
}

interface IUpdateCategoryRequest {
  name?: string;
  image_url?: string;
}

export type {
  ICategory,
  ICategoryListResponse,
  ISingleCategoryResponse,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
};
