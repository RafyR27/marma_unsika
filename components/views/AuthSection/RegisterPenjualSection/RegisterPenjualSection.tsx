"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, Store, ArrowLeft } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { useRegisterPenjual } from "./useRegisterPenjual";

const RegisterPenjualSection = () => {
  const {
    control,
    handleSubmit,
    handleRegister,
    isPendingRegister,
    isSuccessRegister,
    showPassword,
    handleShowPassword,
    showConfirmPassword,
    handleShowConfirmPassword,
  } = useRegisterPenjual();

  const isSubmitting = isPendingRegister || isSuccessRegister;

  return (
    <div className="w-full h-auto max-w-lg lg:max-w-md flex flex-col justify-center items-center gap-5 py-6">
      {/* Header & Typography */}
      <div className="space-y-2 text-center max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
          <Store className="size-3.5" />
          <span>Mitra Penjual</span>
        </div>
        <h1 className="font-bold text-2xl tracking-tight text-foreground sm:text-[1.65rem]">
          Daftar sebagai Penjual
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Buka toko buah Anda, kelola etalase, dan jangkau ribuan pembeli segar di Marma.
        </p>
      </div>

      {/* Form */}
      <form
        className="w-full space-y-4 py-2 flex flex-col"
        onSubmit={handleSubmit(handleRegister)}
      >
        {/* Nama Lengkap */}
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="seller-name">Nama Lengkap</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  id="seller-name"
                  type="text"
                  placeholder="Contoh: Pak Hendra"
                  className="rounded-lg px-4 bg-background h-11 lg:h-9"
                  disabled={isSubmitting}
                />
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Nomor Telepon */}
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="seller-phone">Nomor Telepon / WhatsApp</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  id="seller-phone"
                  type="tel"
                  placeholder="Contoh: 081298765432"
                  className="rounded-lg px-4 bg-background h-11 lg:h-9"
                  disabled={isSubmitting}
                />
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="seller-email">Email</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  id="seller-email"
                  type="email"
                  placeholder="Contoh: hendra@email.com"
                  className="rounded-lg px-4 bg-background h-11 lg:h-9"
                  disabled={isSubmitting}
                />
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Kata Sandi */}
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="seller-password">Kata Sandi</FieldLabel>
              <FieldContent>
                <InputGroup className="rounded-lg bg-background h-11 lg:h-9">
                  <InputGroupInput
                    {...field}
                    id="seller-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    className="px-4"
                    disabled={isSubmitting}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={handleShowPassword}
                      className="px-1 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Konfirmasi Kata Sandi */}
        <Controller
          name="password_confirmation"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="seller-password-confirmation">
                Konfirmasi Kata Sandi
              </FieldLabel>
              <FieldContent>
                <InputGroup className="rounded-lg bg-background h-11 lg:h-9">
                  <InputGroupInput
                    {...field}
                    id="seller-password-confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi kata sandi"
                    className="px-4"
                    disabled={isSubmitting}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={handleShowConfirmPassword}
                      className="px-1 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showConfirmPassword
                          ? "Sembunyikan konfirmasi kata sandi"
                          : "Lihat konfirmasi kata sandi"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-11 lg:h-10 w-full rounded-full mt-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner className="size-4" />
          ) : (
            "Daftar sebagai Penjual"
          )}
        </Button>
      </form>

      {/* Footer Navigation */}
      <div className="w-full flex flex-col items-center gap-3 pt-2 text-xs">
        <p className="text-muted-foreground text-center">
          Sudah memiliki akun?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
          >
            Masuk di sini
          </Link>
        </p>

        <div className="flex items-center gap-4 text-muted-foreground">
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors hover:underline underline-offset-2"
          >
            <ArrowLeft className="size-3" />
            <span>Pilih jenis akun lain</span>
          </Link>
          <span>•</span>
          <Link
            href="/"
            className="hover:text-primary transition-colors hover:underline underline-offset-2"
          >
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPenjualSection;
