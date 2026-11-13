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
import delivery from "@/services/delivery.service";
import { useMe } from "@/hooks/useMe";
import { IDeliveryAddress, IDeliveryFeeBreakdown } from "@/types/order";

export const KARAWANG_PRESET_AREAS = [
  { name: "Unsika / Telukjambe Timur", lat: -6.3262, lng: 107.3045 },
  { name: "Grand Taruma / Karawang Barat", lat: -6.3123, lng: 107.2912 },
  { name: "Galuh Mas Karawang", lat: -6.3190, lng: 107.2980 },
  { name: "Karawang Kota / Tuparev", lat: -6.3050, lng: 107.3000 },
  { name: "Klari / Kosambi", lat: -6.3450, lng: 107.3600 },
  { name: "Rengasdengklok", lat: -6.1580, lng: 107.2980 },
];

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

  // Titik koordinat pengiriman default di Karawang
  const [latitude, setLatitude] = useState<number>(-6.3262);
  const [longitude, setLongitude] = useState<number>(107.3045);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);

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

  const items = cartData?.data || [];

  // Query perhitungan ongkir dinamis Karawang via DeliveryCalculatorService & OSRM
  const {
    data: feeResponse,
    isLoading: isFeeLoading,
    isFetching: isFeeFetching,
  } = useQuery({
    queryKey: ["delivery-fee", latitude, longitude, items.length],
    queryFn: async () => {
      const res = await delivery.calculateFee({
        latitude,
        longitude,
        items: items.map((it) => ({
          product_id: it.product_id,
          quantity: it.quantity,
        })),
      });
      return res.data;
    },
    enabled: typeof window !== "undefined" && items.length > 0,
  });

  const deliveryBreakdown: IDeliveryFeeBreakdown | null =
    feeResponse?.data || null;
  const deliveryFee = deliveryBreakdown?.total_delivery_fee || 20000;

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

  // Pre-fill form & koordinat dari profil pengguna saat dimuat
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

      if (p?.latitude && p?.longitude) {
        setLatitude(Number(p.latitude));
        setLongitude(Number(p.longitude));
      }
    }
  }, [user, form]);

  const detectGps = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung deteksi GPS");
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        toast.success(`Titik GPS berhasil ditentukan (${lat}, ${lng})`, {
          position: "top-right",
        });
      },
      (err) => {
        setIsDetectingGps(false);
        toast.error("Gagal mendeteksi GPS: " + err.message, {
          position: "top-right",
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const { mutate: executeCheckout, isPending: isSubmitting } = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      const deliveryAddress: IDeliveryAddress = {
        recipient_name: values.recipient_name,
        phone: values.phone,
        store_name: values.store_name || null,
        full_address: values.full_address,
        market_name: values.market_name || null,
        block_number: values.block_number || null,
        latitude,
        longitude,
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
    deliveryBreakdown,
    isFeeLoading: isFeeLoading || isFeeFetching,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
    detectGps,
    isDetectingGps,
    presetAreas: KARAWANG_PRESET_AREAS,
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
