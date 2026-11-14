"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

import cart from "@/services/cart.service";
import order from "@/services/order.service";
import delivery, { ILocationSearchResult } from "@/services/delivery.service";
import { useMe } from "@/hooks/useMe";
import { IDeliveryAddress, IDeliveryFeeBreakdown } from "@/types/order";

export const checkoutFormSchema = z.object({
  location_type: z.enum(["rumah", "kios", "warung", "ruko_kantor", "lainnya"]),
  recipient_name: z.string().min(2, "Nama penerima minimal 2 karakter"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^[0-9+]+$/, "Nomor telepon hanya boleh berisi angka"),
  store_name: z.string().optional(),
  street_address: z.string().min(3, "Nama jalan, gang, atau nomor bangunan wajib diisi"),
  block_number: z.string().optional(),
  district: z.string().optional(),
  landmark: z.string().optional(),
  full_address: z.string().min(5, "Alamat lengkap pengiriman wajib diisi"),
  market_name: z.string().optional(),
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

  // Pencarian nama jalan / lokasi di Karawang
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ILocationSearchResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState<boolean>(false);

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
      location_type: "rumah",
      recipient_name: "",
      phone: "",
      store_name: "",
      street_address: "",
      block_number: "",
      district: "",
      landmark: "",
      full_address: "",
      market_name: "",
      notes: "",
    },
  });

  // Pre-fill form & koordinat dari profil pengguna saat dimuat
  useEffect(() => {
    if (user) {
      const p = user.profile;
      const initialType =
        user.role === "seller"
          ? "kios"
          : p?.store_name
          ? "warung"
          : "rumah";

      form.reset({
        location_type: initialType,
        recipient_name: user.name || "",
        phone: user.phone || "",
        store_name: p?.store_name || "",
        street_address: p?.full_address || "",
        block_number: p?.block_number || "",
        district: p?.market_name || "Karawang",
        landmark: "",
        full_address: p?.full_address || "",
        market_name: p?.market_name || "",
        notes: "",
      });

      if (p?.latitude && p?.longitude) {
        setLatitude(Number(p.latitude));
        setLongitude(Number(p.longitude));
      }
    }
  }, [user, form]);

  // Sinkronisasi otomatis alamat lengkap jika field rincian diubah
  const syncFullAddress = useCallback(() => {
    const cur = form.getValues();
    const typeLabel =
      cur.location_type === "kios"
        ? "[Kios / Lapak Pasar]"
        : cur.location_type === "warung"
        ? "[Warung Kelontong]"
        : cur.location_type === "ruko_kantor"
        ? "[Ruko / Kantor]"
        : cur.location_type === "rumah"
        ? "[Rumah Tinggal]"
        : "";

    const parts: string[] = [];
    if (typeLabel) parts.push(typeLabel);
    if (cur.store_name) parts.push(cur.store_name);
    if (cur.street_address) parts.push(cur.street_address);
    if (cur.block_number) parts.push(`Blok/No: ${cur.block_number}`);
    if (cur.district) parts.push(cur.district);
    if (cur.landmark) parts.push(`(Patokan: ${cur.landmark})`);

    const combined = parts.join(", ");
    if (combined.trim().length >= 5) {
      form.setValue("full_address", combined, { shouldValidate: true });
    }
  }, [form]);

  // Fungsi pencarian lokasi / nama jalan di Karawang
  const handleSearchLocation = async (customQuery?: string) => {
    const query = (customQuery ?? searchLocationQuery).trim();
    if (query.length < 2) {
      toast.info("Ketik minimal 2 karakter untuk mencari lokasi.");
      return;
    }

    setIsSearchingLocation(true);
    try {
      const res = await delivery.searchLocation(query);
      const results = res.data?.data || [];
      setSearchResults(results);
      if (results.length === 0) {
        toast.info("Lokasi tidak ditemukan. Coba ketik nama jalan, perumahan, atau kelurahan lain.");
      }
    } catch {
      toast.error("Gagal mencari lokasi. Silakan coba lagi.");
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSelectLocationResult = (loc: ILocationSearchResult) => {
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    setSearchResults([]);
    setSearchLocationQuery(loc.name);

    // Otomatis isi kolom rincian alamat jika masih kosong
    const currentStreet = form.getValues("street_address");
    if (!currentStreet || currentStreet.trim().length === 0) {
      form.setValue("street_address", loc.name);
    }
    form.setValue("district", loc.display_name.split(",").slice(1, 3).join(",").trim());

    syncFullAddress();

    toast.success(`Titik pengantaran dipilih: ${loc.name}`, {
      position: "top-right",
    });
  };

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
        let msg = "GPS tidak dapat diakses.";
        if (err.code === 1) {
          msg = "Izin akses lokasi ditolak oleh browser. Anda dapat mencari nama jalan atau mengetik alamat rinci di formulir.";
        } else if (err.code === 2) {
          msg = "Posisi GPS tidak tersedia. Silakan gunakan pencarian nama jalan atau ketik alamat rinci.";
        } else if (err.code === 3) {
          msg = "Waktu deteksi GPS perangkat habis (timeout). Silakan ketik nama jalan atau gunakan pencarian lokasi di formulir.";
        }
        toast.info(msg, { position: "top-right", duration: 5000 });
      },
      { timeout: 12000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  };

  const { mutate: executeCheckout, isPending: isSubmitting } = useMutation({
    mutationFn: async (values: CheckoutFormValues) => {
      const deliveryAddress: IDeliveryAddress = {
        recipient_name: values.recipient_name,
        phone: values.phone,
        store_name: values.store_name || null,
        full_address: values.full_address,
        market_name: values.district || values.market_name || null,
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
    searchLocationQuery,
    setSearchLocationQuery,
    searchResults,
    setSearchResults,
    isSearchingLocation,
    handleSearchLocation,
    handleSelectLocationResult,
    syncFullAddress,
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
