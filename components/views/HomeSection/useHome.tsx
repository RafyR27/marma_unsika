"use client";

import product, { IProductQueryParams } from "@/services/product.service";
import { useQuery } from "@tanstack/react-query";

export const useHome = (params?: IProductQueryParams) => {
  const {
    data: productData,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const response = await product.products(params);
      return response.data;
    },
  });

  return {
    productData,
    products: productData?.data ?? [],
    pagination: {
      links: productData?.links,
      meta: productData?.meta,
    },
    isLoadingProducts,
    isFetchingProducts,
    isErrorProducts,
    errorProducts,
    refetchProducts,
  };
};
