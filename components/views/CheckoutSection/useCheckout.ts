"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

import cart from "@/services/cart.service";
import order from "@/services/order.service";
import { useMe } from "@/hooks/useMe";
import { IDeliveryAddress } from "@/types/order";

export const checkoutFormSchema = z.object({
  recipient_name: z.string().min(2, "Nama penerima minimal 2 karakter"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^[0-9+]+$/, "Nomor telepon hanya boleh berisi angka"),
  store_name: z.string().optional(),
  full_address: z.string().min(5, "Alamat lengkap pengiriman wajib diisi"),
  market_name: z.string().optional(),
  block_number: z.string().optional(),
  notes: z.string().max(1000, "Catatan maksimal 1000 karakter").optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export const useCheckout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useMe();
  const [deliveryFee] = useState<number>(20000);

  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cart.getCart();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      recipient_name: "",
      phone: "",
      store_name: "",
      full_address: "",
      market_name: "",
      block_number: "",
      notes: "",
    },
  });

  // Pre-fill form from user profile when loaded
  useEffect(() => {
    if (user) {
      const p = user.profile;
      form.reset({
        recipient_name: user.name || "",
        phone: user.phone || "",
        store_name: p?.store_name || "",
        full_address: p?.full_address || "",
        market_name: p?.market_name || "",
        block_number: p?.block_number || "",
        notes: "",
      });
    }
  }, [user, form]);

  const { mutate: executeCheckout, isPending: isSubmitting } = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      const deliveryAddress: IDeliveryAddress = {
        recipient_name: values.recipient_name,
        phone: values.phone,
        store_name: values.store_name || null,
        full_address: values.full_address,
        market_name: values.market_name || null,
        block_number: values.block_number || null,
        latitude: user?.profile?.latitude ?? null,
        longitude: user?.profile?.longitude ?? null,
      };

      const response = await order.checkout({
        delivery_fee: deliveryFee,
        notes: values.notes || null,
        delivery_address: deliveryAddress,
      });

      return response.data;
    },
    onSuccess: (data) => {
      const createdOrder = data.data;
      toast.success("Pesanan berhasil dibuat!", { position: "top-right" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.push(`/user/orders/${createdOrder.order_number}/payment`);
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(
        err?.response?.data?.message || err?.message || "Gagal membuat pesanan",
        { position: "top-right" }
      );
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    executeCheckout(values);
  };

  const items = cartData?.data || [];
  const subtotalProducts = items.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price || 0),
    0
  );
  const totalAmount = subtotalProducts + deliveryFee;

  return {
    user,
    cartData,
    items,
    deliveryFee,
    subtotalProducts,
    totalAmount,
    isUserLoading,
    isCartLoading,
    isCartError,
    isSubmitting,
    form,
    onSubmit,
  };
};
