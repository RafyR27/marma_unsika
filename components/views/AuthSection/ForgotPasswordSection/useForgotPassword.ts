"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(10, "Nomor telepon atau email minimal 10 karakter")
    .refine(
      (val) => {
        const isPhone = /^[0-9+]+$/.test(val);
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        return isPhone || isEmail;
      },
      {
        message: "Masukkan nomor telepon yang valid atau alamat email resmi",
      }
    ),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const useForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedIdentifier, setSubmittedIdentifier] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { control, handleSubmit, reset } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsPending(true);
    // Simulasi pengiriman instruksi reset sandi ke nomor / email
    setTimeout(() => {
      setIsPending(false);
      setIsSubmitted(true);
      setSubmittedIdentifier(values.identifier);
      toast.success(
        "Instruksi pemulihan kata sandi telah dikirimkan ke kontak Anda.",
        { position: "top-right" }
      );
    }, 800);
  };

  const handleResetAgain = () => {
    setIsSubmitted(false);
    setSubmittedIdentifier("");
    reset();
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isPending,
    isSubmitted,
    submittedIdentifier,
    handleResetAgain,
  };
};
