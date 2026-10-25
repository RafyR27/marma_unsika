"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import user from "@/services/user.service";
import { IRegister } from "@/types/user";

export const registerSellerSchema = z
  .object({
    name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
    phone: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .regex(/^[0-9+]+$/, "Nomor telepon hanya boleh berisi angka"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    password_confirmation: z
      .string()
      .min(1, "Konfirmasi kata sandi wajib diisi"),
    role: z.literal("seller"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["password_confirmation"],
  });

export type RegisterSellerFormValues = z.infer<typeof registerSellerSchema>;

export const useRegisterPenjual = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const { control, handleSubmit } = useForm<RegisterSellerFormValues>({
    resolver: zodResolver(registerSellerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "seller",
    },
  });

  const {
    mutate: mutateRegister,
    isPending: isPendingRegister,
    isSuccess: isSuccessRegister,
  } = useMutation({
    mutationFn: (payload: IRegister) => user.register(payload),
    onError(error: Error) {
      toast.error(error?.message || "Terjadi kesalahan saat pendaftaran", {
        position: "top-right",
      });
    },
    onSuccess: () => {
      toast.success(
        "Pendaftaran penjual berhasil! Silakan masuk ke akun Anda.",
        {
          position: "top-right",
        },
      );
      router.push("/auth/login");
    },
  });

  const handleRegister = (values: RegisterSellerFormValues) => {
    mutateRegister(values);
  };

  return {
    control,
    handleSubmit,
    handleRegister,
    isPendingRegister,
    isSuccessRegister,
    showPassword,
    handleShowPassword,
    showConfirmPassword,
    handleShowConfirmPassword,
  };
};
