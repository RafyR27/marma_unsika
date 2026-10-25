"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "./useLogin";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import Link from "next/link";
import { Controller } from "react-hook-form";

const LoginSection = () => {
  const {
    isSuccessLogin,
    handleShowPassword,
    showPassword,
    isPendingLogin,
    control,
    handleLogin,
    handleSubmit,
  } = useLogin();

  return (
    <div className="w-full h-auto max-w-lg lg:max-w-sm flex flex-col justify-center items-center gap-5 py-10">
      <div className="space-y-1 text-center">
        <h1 className="font-bold text-[1.1rem]">Selamat Datang Kembali</h1>
        <p className="text-muted-foreground text-[0.9rem] lg:text-[0.9rem]">
          Masuk dan dapatkan buah segar sekarang.
        </p>
      </div>

      <form
        className="w-full space-y-7 py-5 flex flex-col"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>

              <FieldContent>
                <Input
                  {...field}
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Masukkan nomor telepon"
                  className="rounded-lg px-5 bg-background h-11 lg:h-9"
                  disabled={isPendingLogin || isSuccessLogin}
                />
              </FieldContent>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>

                <Link
                  href={"/auth/forgot-password"}
                  className="text-primary hover:underline text-[0.8rem]"
                >
                  Lupa Kata Sandi?
                </Link>
              </div>

              <FieldContent>
                <InputGroup className="rounded-lg bg-background h-11 lg:h-9">
                  <InputGroupInput
                    {...field}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    className="px-5 "
                    disabled={isPendingLogin || isSuccessLogin}
                  />
                  <InputGroupAddon align="inline-end">
                    <button
                      type="button"
                      onClick={handleShowPassword}
                      className="px-1"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </InputGroupAddon>
                </InputGroup>
              </FieldContent>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit */}
        <Button
          type="submit"
          className="h-11 lg:h-10 w-full rounded-full"
          disabled={isPendingLogin || isSuccessLogin}
        >
          {isPendingLogin || isSuccessLogin ? (
            <Spinner className="size-4" />
          ) : (
            "Masuk"
          )}
        </Button>

        <p className="text-[0.75rem] self-center">
          Belum memiliki akun?{"  "}
          <Link
            href={"/auth/register"}
            className="w-full text-primary hover:underline underline-offset-2"
          >
            Daftar
          </Link>
        </p>
      </form>

      <div className="w-full flex flex-col items-center gap-2">
        <Link
          href={"/"}
          className="text-[0.75rem] text-primary text-center w-full hover:underline underline-offset-2"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
};

export default LoginSection;
