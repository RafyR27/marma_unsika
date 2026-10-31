"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import admin from "@/services/admin.service";
import { IAuthUser } from "@/types/user";

export const useAdminUsers = () => {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Modal toggle status
  const [togglingUser, setTogglingUser] = useState<IAuthUser | null>(null);

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
  };
};
