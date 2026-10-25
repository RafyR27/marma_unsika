import { ICategory } from "./category";

interface ISellerProfile {
  id: number;
  user_id: number;
  store_name: string;
  market_name: string;
  block_number: string;
  full_address: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

interface ISeller {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  role: string;
  is_active: boolean;
  profile?: ISellerProfile | null;
  created_at: string;
  updated_at: string;
}

type ProductUnit = "kg" | "ikat" | "karung" | "peti" | string;
type ProductSort = "newest" | "price_asc" | "price_desc";

interface IProduct {
  id: number;
  seller_id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  formatted_price: string;
  unit: ProductUnit;
  min_order: number;
  stock: number;
  image_url: string | null;
  is_available: boolean;
  seller?: ISeller;
  category?: ICategory;
  created_at: string;
  updated_at: string;
}

interface IPaginationMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface IPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

interface IPaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: IPaginationMetaLink[];
  path: string;
  per_page: number;
  to?: number | null;
  total?: number;
}

interface IProductResponse {
  data: IProduct[];
  links: IPaginationLinks;
  meta: IPaginationMeta;
}

interface ISingleProductResponse {
  data: IProduct;
}

interface IProductQueryParams {
  category?: string;
  category_id?: number;
  search?: string;
  seller_id?: number;
  sort?: ProductSort | string;
  per_page?: number;
  page?: number;
  [key: string]: unknown;
}

interface ISellerProductQueryParams {
  search?: string;
  per_page?: number;
  page?: number;
  [key: string]: unknown;
}

interface IStoreProductRequest {
  category_id: number;
  name: string;
  description?: string | null;
  price: number;
  unit: ProductUnit;
  min_order?: number;
  stock: number;
  image_url?: string | null;
  is_available?: boolean;
}

interface IUpdateProductRequest {
  category_id?: number;
  name?: string;
  description?: string | null;
  price?: number;
  unit?: ProductUnit;
  min_order?: number;
  stock?: number;
  image_url?: string | null;
  is_available?: boolean;
}

export type {
  ProductUnit,
  ProductSort,
  IProduct,
  IProductResponse,
  ISingleProductResponse,
  IProductQueryParams,
  ISellerProductQueryParams,
  IStoreProductRequest,
  IUpdateProductRequest,
  ISeller,
  ISellerProfile,
  ICategory,
  IPaginationLinks,
  IPaginationMeta,
  IPaginationMetaLink,
};