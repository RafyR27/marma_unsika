/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

import user from "@/services/user.service";
import { useQueryClient } from "@tanstack/react-query";

export interface LogoutDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
  redirectTo?: string;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export default function LogoutDialog({
  open,
  onOpenChange,
  trigger,
  redirectTo = "/auth/login",
  onSuccess,
  title = "Konfirmasi Keluar",
  description = "Apakah Anda yakin ingin keluar dari akun ini? Anda perlu masuk kembali untuk mengakses halaman ini.",
}: LogoutDialogProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsPending(true);
      await user.logout().catch(() => {});
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      toast.success("Berhasil keluar", { position: "top-right" });
      handleOpenChange(false);
      onSuccess?.();
      router.push(redirectTo);
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat logout");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger as any} />}
      <DialogContent className="max-w-sm md:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm pt-3">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 justify-end sm:justify-end">
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                className="h-11 md:h-9"
              >
                Batal
              </Button>
            }
          />
          <Button
            type="button"
            variant="destructive"
            onClick={handleSignOut}
            disabled={isPending}
            className="w-full md:w-20 h-11 md:h-9"
          >
            {isPending ? <Spinner /> : "Keluar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
