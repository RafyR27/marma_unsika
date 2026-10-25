"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import user from "@/services/user.service";
import { ILogin } from "@/types/user";

export const formLoginSchema = z.object({
  phone: z
    .string()
    .min(1, "Nomor telepon wajib diisi")
    .regex(/^[0-9+]+$/, "Nomor telepon hanya boleh berisi angka"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export type FormLoginValues = z.infer<typeof formLoginSchema>;

export const getRoleDashboard = (role?: string) => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "/admin/dashboard";
    case "seller":
      return "/seller/dashboard";
    case "courier":
      return "/courier/dashboard";
    default:
      return "/";
  }
};

export const useLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const { control, handleSubmit } = useForm<FormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const {
    mutate: mutateLogin,
    isPending: isPendingLogin,
    isSuccess: isSuccessLogin,
  } = useMutation({
    mutationFn: (payload: ILogin) => user.login(payload),
    onError(error: Error) {
      toast.error(error?.message || "Terjadi kesalahan saat masuk", {
        position: "top-right",
      });
    },
    onSuccess: (response) => {
      const responseData = response?.data;
      const authData = responseData?.data;
      const currentUser = authData?.user;
      const token = authData?.token;
      const role = currentUser?.role;

      if (typeof window !== "undefined") {
        if (token) {
          localStorage.setItem("token", token);
        }
        if (currentUser) {
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      }

      toast.success(responseData?.message || "Login berhasil!", {
        position: "top-right",
      });

      const redirectPath = getRoleDashboard(role);
      router.push(redirectPath);
    },
  });

  const handleLogin = (values: FormLoginValues) => {
    mutateLogin(values);
  };

  return {
    isSuccessLogin,
    handleShowPassword,
    showPassword,
    handleLogin,
    control,
    handleSubmit,
    isPendingLogin,
  };
};
