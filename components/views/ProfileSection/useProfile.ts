"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";

import profile from "@/services/profile.service";
import { IAuthUser } from "@/types/user";

export const profileFormSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^[0-9+]+$/, "Nomor telepon hanya boleh berisi angka"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  store_name: z.string().optional().or(z.literal("")),
  market_name: z.string().optional().or(z.literal("")),
  block_number: z.string().optional().or(z.literal("")),
  full_address: z.string().optional().or(z.literal("")),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const passwordFormSchema = z
  .object({
    current_password: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    password: z.string().min(8, "Kata sandi baru minimal 8 karakter"),
    password_confirmation: z
      .string()
      .min(1, "Konfirmasi kata sandi baru wajib diisi"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi kata sandi baru tidak cocok",
    path: ["password_confirmation"],
  });

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export const useProfile = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 1. Fetch data profil
  const {
    data: profileResponse,
    isLoading: isProfileLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await profile.getProfile();
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const currentUser = profileResponse?.data;

  // 2. Form Profil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      store_name: "",
      market_name: "",
      block_number: "",
      full_address: "",
      latitude: null,
      longitude: null,
    },
  });

  // Sinkronkan data profil ke form saat data selesai dimuat
  useEffect(() => {
    if (currentUser) {
      const p = currentUser.profile;
      profileForm.reset({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
        store_name: p?.store_name || "",
        market_name: p?.market_name || "",
        block_number: p?.block_number || "",
        full_address: p?.full_address || "",
        latitude: p?.latitude ?? null,
        longitude: p?.longitude ?? null,
      });
    }
  }, [currentUser, profileForm]);

  // 3. Form Ganti Password
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  // 4. Mutasi Update Profil
  const { mutate: mutateUpdateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (values: ProfileFormValues) => {
        const payload = {
          name: values.name,
          phone: values.phone,
          email: values.email || null,
          store_name: values.store_name || null,
          market_name: values.market_name || null,
          block_number: values.block_number || null,
          full_address: values.full_address || null,
          latitude: values.latitude ?? null,
          longitude: values.longitude ?? null,
        };
        const res = await profile.updateProfile(payload);
        return res.data;
      },
      onSuccess: (data) => {
        const updatedUser = data.data;
        if (typeof window !== "undefined" && updatedUser) {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        toast.success(data.message || "Profil lapak berhasil diperbarui!", {
          position: "top-right",
        });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      },
      onError: (error: unknown) => {
        const err = error as AxiosError<{ message?: string }> | Error;
        const msg =
          (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
          err.message ||
          "Gagal memperbarui profil";
        toast.error(msg, { position: "top-right" });
      },
    });

  // 5. Mutasi Ganti Password
  const { mutate: mutateUpdatePassword, isPending: isUpdatingPassword } =
    useMutation({
      mutationFn: async (values: PasswordFormValues) => {
        const res = await profile.updatePassword({
          current_password: values.current_password,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });
        return res.data;
      },
      onSuccess: (data) => {
        toast.success(
          data.message || "Kata sandi akun Anda berhasil diperbarui!",
          { position: "top-right" }
        );
        passwordForm.reset();
      },
      onError: (error: unknown) => {
        const err = error as AxiosError<{ message?: string }> | Error;
        const msg =
          (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
          err.message ||
          "Gagal memperbarui kata sandi";
        toast.error(msg, { position: "top-right" });
      },
    });

  const onProfileSubmit = (values: ProfileFormValues) => {
    mutateUpdateProfile(values);
  };

  const onPasswordSubmit = (values: PasswordFormValues) => {
    mutateUpdatePassword(values);
  };

  return {
    currentUser,
    isProfileLoading,
    isError,
    refetch,
    activeTab,
    setActiveTab,
    profileForm,
    onProfileSubmit,
    isUpdatingProfile,
    passwordForm,
    onPasswordSubmit,
    isUpdatingPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
};
