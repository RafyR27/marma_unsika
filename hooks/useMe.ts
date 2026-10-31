"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import user from "@/services/user.service";
import { IAuthUser } from "@/types/user";

export const useMe = () => {
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Rehidrasi cache user dari localStorage setelah komponen mount di client.
    // Menghindari Hydration Mismatch (SSR render text != Client render text).
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored && !queryClient.getQueryData(["auth", "me"])) {
        try {
          queryClient.setQueryData(
            ["auth", "me"],
            JSON.parse(stored) as IAuthUser,
          );
        } catch {
          // ignore parsing error
        }
      }
    }
  }, [queryClient]);

  const query = useQuery<IAuthUser | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await user.me();
        const userData = response.data?.data;

        if (typeof window !== "undefined" && userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        return userData ?? null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Jika token tidak valid atau expired (401 Unauthorized), hapus storage
        if (error?.response?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
        throw error;
      }
    },
    // Hanya lakukan fetch ke server jika komponen sudah mount dan ada token di browser
    enabled: mounted && typeof window !== "undefined" && !!localStorage.getItem("token"),
    staleTime: 1000 * 60 * 5, // Cache valid selama 5 menit
    retry: 1,
  });

  return {
    ...query,
    isMounted: mounted,
    isLoading: !mounted || query.isLoading,
  };
};
