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

export type { ICategory, ICategoryListResponse };
