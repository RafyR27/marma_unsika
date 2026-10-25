import instance from "@/lib/instance";
import {
  IProductQueryParams,
  IProductResponse,
  ISellerProductQueryParams,
  ISingleProductResponse,
  IStoreProductRequest,
  IUpdateProductRequest,
} from "@/types/product";

export type { IProductQueryParams, ISellerProductQueryParams };

const product = {
  // Public
  products: (params?: IProductQueryParams) =>
    instance.get<IProductResponse>("/products", { params }),
  getProducts: (params?: IProductQueryParams) =>
    instance.get<IProductResponse>("/products", { params }),
  getProductBySlug: (slug: string) =>
    instance.get<ISingleProductResponse>(`/products/${slug}`),

  // Seller
  storeProduct: (payload: IStoreProductRequest) =>
    instance.post<ISingleProductResponse>("/products", payload),
  updateProduct: (slug: string, payload: IUpdateProductRequest) =>
    instance.put<ISingleProductResponse>(`/products/${slug}`, payload),
  deleteProduct: (slug: string) => instance.delete<void>(`/products/${slug}`),
  getSellerProducts: (params?: ISellerProductQueryParams) =>
    instance.get<IProductResponse>("/seller/products", { params }),
};

export default product;
