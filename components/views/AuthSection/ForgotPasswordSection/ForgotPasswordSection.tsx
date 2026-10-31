"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import {
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  Phone,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

import { useForgotPassword } from "./useForgotPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export default function ForgotPasswordSection() {
  const {
    control,
    handleSubmit,
    onSubmit,
    isPending,
    isSubmitted,
    submittedIdentifier,
    handleResetAgain,
  } = useForgotPassword();

  return (
    <div className="w-full h-auto max-w-lg lg:max-w-sm flex flex-col justify-center items-center gap-5 py-10">
      {/* State 1: Form Input */}
      {!isSubmitted ? (
        <>
          <div className="space-y-1.5 text-center">
            <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2 border border-primary/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl text-foreground">
              Pemulihan Kata Sandi
            </h1>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Masukkan nomor telepon WhatsApp atau alamat email terdaftar untuk menerima instruksi pemulihan akun Anda.
            </p>
          </div>

          <form
            className="w-full space-y-5 py-3 flex flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="identifier"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="identifier">
                    Nomor Telepon atau Email
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      id="identifier"
                      type="text"
                      placeholder="Contoh: 0812xxxxxxxx atau nama@email.com"
                      className="rounded-lg px-4 bg-background h-11 lg:h-10 text-sm"
                      disabled={isPending}
                    />
                  </FieldContent>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              className="h-11 lg:h-10 w-full rounded-full font-semibold text-xs"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Mengirim Instruksi...
                </>
              ) : (
                "Kirim Tautan Pemulihan"
              )}
            </Button>
          </form>

          {/* Kotak Bantuan Darurat Pengelola Pasar */}
          <div className="w-full p-4 rounded-xl border bg-muted/30 text-xs space-y-2 mt-2">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span>Bantuan Operasional Pasar</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Jika akun kios atau kurir Anda terkendala akses mendesak, silakan hubungi Pos Pengelola Pasar Makar via WhatsApp resmi:
            </p>
            <a
              href="https://wa.me/6281100000001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Helpdesk Pasar (0811-0000-0001)
            </a>
          </div>
        </>
      ) : (
        /* State 2: Konfirmasi Terkirim */
        <div className="w-full text-center space-y-4 py-4">
          <div className="size-14 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 flex items-center justify-center mx-auto border border-green-500/20">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="font-bold text-xl text-foreground">
              Instruksi Pemulihan Terkirim
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kami telah mengirimkan instruksi dan kode verifikasi pengaturan ulang sandi ke:
            </p>
            <p className="font-mono font-bold text-sm text-primary pt-1">
              {submittedIdentifier}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border bg-muted/40 text-left text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Langkah Selanjutnya:</p>
            <p>1. Periksa pesan masuk WhatsApp atau email Anda.</p>
            <p>2. Buka tautan verifikasi dan buat kata sandi baru.</p>
            <p>3. Masuk kembali ke akun Anda dengan kata sandi baru.</p>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              className="w-full rounded-full h-10 font-semibold text-xs"
              nativeButton={false}
              render={<Link href="/auth/login" />}
            >
              Kembali ke Halaman Masuk
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetAgain}
              className="w-full rounded-full text-xs text-muted-foreground"
            >
              Kirim Ulang ke Kontak Lain
            </Button>
          </div>
        </div>
      )}

      {/* Navigasi Footer */}
      <div className="w-full flex flex-col items-center gap-2 pt-2 text-xs">
        <Link
          href="/auth/login"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 hover:underline underline-offset-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke halaman masuk
        </Link>

        <Link
          href="/"
          className="text-muted-foreground hover:text-primary hover:underline underline-offset-2 transition-colors"
        >
          Kembali ke beranda katalog
        </Link>
      </div>
    </div>
  );
}
