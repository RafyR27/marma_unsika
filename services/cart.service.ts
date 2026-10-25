import instance from "@/lib/instance";
import {
  IAddToCartRequest,
  ICartResponse,
  ISingleCartItemResponse,
  IUpdateCartRequest,
} from "@/types/cart";
import { IMessageResponse } from "@/types/user";

const cart = {
  getCart: () => instance.get<ICartResponse>("/cart"),
  addToCart: (payload: IAddToCartRequest) =>
    instance.post<ISingleCartItemResponse>("/cart", payload),
  clearCart: () => instance.delete<IMessageResponse>("/cart"),
  updateCartItem: (cartId: number | string, payload: IUpdateCartRequest) =>
    instance.put<ISingleCartItemResponse>(`/cart/${cartId}`, payload),
  deleteCartItem: (cartId: number | string) =>
    instance.delete<IMessageResponse>(`/cart/${cartId}`),
};

export default cart;
