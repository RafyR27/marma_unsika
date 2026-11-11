"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import admin from "@/services/admin.service";
import { IAuthUser } from "@/types/user";
import { ICreateUserPayload } from "@/types/admin";

export interface IUserFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
  store_name?: string;
  market_name?: string;
  block_number?: string;
  full_address?: string;
}

export const useAdminUsers = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Modal toggle status
  const [togglingUser, setTogglingUser] = useState<IAuthUser | null>(null);

  // Modal Create User States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createPasswordConfirmation, setCreatePasswordConfirmation] = useState("");
  const [createRole, setCreateRole] = useState<"buyer" | "seller" | "courier" | "admin">("buyer");
  const [createStoreName, setCreateStoreName] = useState("");
  const [createMarketName, setCreateMarketName] = useState("");
  const [createBlockNumber, setCreateBlockNumber] = useState("");
  const [createFullAddress, setCreateFullAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<IUserFormErrors>({});

  const {
    data: usersResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin", "users", roleFilter, statusFilter, search, page],
    queryFn: async () => {
      const params: {
        role?: string;
        is_active?: boolean | string;
        search?: string;
        page: number;
        per_page: number;
      } = {
        page,
        per_page: 15,
      };

      if (roleFilter !== "all") params.role = roleFilter;
      if (statusFilter === "active") params.is_active = true;
      if (statusFilter === "inactive") params.is_active = false;
      if (search.trim()) params.search = search.trim();

      const res = await admin.getUsers(params);
      return res.data;
    },
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
  });

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;

  const { mutate: executeUpdateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: async ({
      userId,
      isActive,
    }: {
      userId: number;
      isActive: boolean;
    }) => {
      const res = await admin.updateUserStatus(userId, { is_active: isActive });
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(
        variables.isActive
          ? "Akun pengguna berhasil diaktifkan kembali."
          : "Akun dinonaktifkan. Seluruh sesi token pengguna telah dicabut otomatis.",
        { position: "top-right" }
      );
      setTogglingUser(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message?: string }> | Error;
      const msg =
        (err as AxiosError<{ message?: string }>)?.response?.data?.message ||
        err.message ||
        "Gagal mengubah status akun pengguna";
      toast.error(msg, { position: "top-right" });
    },
  });

  const resetCreateForm = () => {
    setCreateName("");
    setCreatePhone("");
    setCreateEmail("");
    setCreatePassword("");
    setCreatePasswordConfirmation("");
    setCreateRole("buyer");
    setCreateStoreName("");
    setCreateMarketName("");
    setCreateBlockNumber("");
    setCreateFullAddress("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormErrors({});
  };

  const { mutate: executeCreateUser, isPending: isCreatingUser } = useMutation({
    mutationFn: async (payload: ICreateUserPayload) => {
      const res = await admin.createUser(payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Akun pengguna baru berhasil didaftarkan.", {
        position: "top-right",
      });
      resetCreateForm();
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;
      const resData = err?.response?.data;

      if (resData?.errors) {
        const mappedErrors: IUserFormErrors = {};
        for (const [key, messages] of Object.entries(resData.errors)) {
          if (messages && messages.length > 0) {
            mappedErrors[key as keyof IUserFormErrors] = messages[0];
          }
        }
        setFormErrors(mappedErrors);

        const firstKey = Object.keys(resData.errors)[0];
        const firstMsg = resData.errors[firstKey]?.[0] || resData.message;
        toast.error(firstMsg, { position: "top-right" });
      } else {
        toast.error(
          resData?.message ||
            err.message ||
            "Gagal mendaftarkan akun pengguna baru.",
          { position: "top-right" }
        );
      }
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors: IUserFormErrors = {};
    const trimmedName = createName.trim();
    const trimmedPhone = createPhone.trim();
    const trimmedEmail = createEmail.trim();

    if (!trimmedName) {
      errors.name = "Nama lengkap wajib diisi.";
    }

    if (!trimmedPhone) {
      errors.phone = "Nomor telepon/WhatsApp wajib diisi.";
    } else if (!/^[0-9+]{9,16}$/.test(trimmedPhone)) {
      errors.phone = "Format nomor telepon tidak valid (minimal 9-16 digit angka).";
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Format alamat email tidak valid.";
    }

    if (!createPassword) {
      errors.password = "Kata sandi wajib diisi.";
    } else if (createPassword.length < 8) {
      errors.password = "Kata sandi minimal 8 karakter.";
    }

    if (createPassword !== createPasswordConfirmation) {
      errors.password_confirmation = "Konfirmasi kata sandi tidak cocok.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const payload: ICreateUserPayload = {
      name: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail || null,
      password: createPassword,
      password_confirmation: createPasswordConfirmation,
      role: createRole,
      store_name: createStoreName.trim() || null,
      market_name: createMarketName.trim() || null,
      block_number: createBlockNumber.trim() || null,
      full_address: createFullAddress.trim() || null,
    };

    executeCreateUser(payload);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return {
    users,
    meta,
    roleFilter,
    setRoleFilter: (r: string) => {
      setRoleFilter(r);
      setPage(1);
    },
    statusFilter,
    setStatusFilter: (s: string) => {
      setStatusFilter(s);
      setPage(1);
    },
    search,
    searchInput,
    setSearchInput,
    handleSearchSubmit,
    page,
    setPage,
    isLoading,
    isError,
    refetch,
    togglingUser,
    setTogglingUser,
    executeUpdateStatus,
    isUpdatingStatus,
    // Create User modal & form states
    isCreateModalOpen,
    setIsCreateModalOpen: (open: boolean) => {
      setIsCreateModalOpen(open);
      if (!open) resetCreateForm();
    },
    createName,
    setCreateName,
    createPhone,
    setCreatePhone,
    createEmail,
    setCreateEmail,
    createPassword,
    setCreatePassword,
    createPasswordConfirmation,
    setCreatePasswordConfirmation,
    createRole,
    setCreateRole,
    createStoreName,
    setCreateStoreName,
    createMarketName,
    setCreateMarketName,
    createBlockNumber,
    setCreateBlockNumber,
    createFullAddress,
    setCreateFullAddress,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    formErrors,
    handleCreateUser,
    isCreatingUser,
    resetCreateForm,
  };
};
