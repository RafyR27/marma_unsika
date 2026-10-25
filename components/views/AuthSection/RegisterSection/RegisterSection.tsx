"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Store, CheckCircle2, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

const RegisterSection = () => {
  return (
    <div className="w-full h-auto max-w-lg flex flex-col justify-center items-center gap-6 py-6">
      {/* Header & Typography */}
      <div className="space-y-2 text-center max-w-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="size-3.5" />
          <span>Pendaftaran Akun</span>
        </div>
        <h1 className="font-bold text-2xl tracking-tight text-foreground sm:text-[1.65rem]">
          Pilih Jenis Akun Anda
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Pilih peran yang paling sesuai untuk mulai menikmati pengalaman terbaik berbelanja dan berjualan di Marma.
        </p>
      </div>

      {/* Role Selection Cards & Action Buttons */}
      <div className="w-full flex flex-col gap-4">
        {/* Buyer Option Card */}
        <div className="group relative rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
              <ShoppingBag className="size-6" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Daftar sebagai Pembeli
                </h2>
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Konsumen
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Nikmati kemudahan berbelanja aneka buah segar berkualitas langsung dari mitra tani dan penjual pilihan.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60">
            <ul className="space-y-1.5 mb-4 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>Katalog buah segar lengkap & terjamin kualitasnya</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>Pengiriman cepat langsung ke lokasimu</span>
              </li>
            </ul>

            <Link
              href="/auth/register/buyer"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-10 rounded-xl justify-between px-4 font-semibold text-xs sm:text-sm group-hover:shadow-md transition-all"
              )}
            >
              <span>Lanjut sebagai Pembeli</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Seller Option Card */}
        <div className="group relative rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-xl bg-secondary/30 text-primary flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
              <Store className="size-6" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  Daftar sebagai Penjual
                </h2>
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                  Mitra / Toko
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Buka toko buah Anda, kelola stok dan produk secara efisien, serta jangkau ribuan pelanggan di Unsika & sekitarnya.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60">
            <ul className="space-y-1.5 mb-4 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>Kelola etalase buah dan pantau pesanan real-time</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                <span>Tingkatkan omzet dengan akses pasar yang luas</span>
              </li>
            </ul>

            <Link
              href="/auth/register/seller"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full h-10 rounded-xl justify-between px-4 font-semibold text-xs sm:text-sm border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground group-hover:border-primary transition-all"
              )}
            >
              <span>Lanjut sebagai Penjual</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Navigation Typography */}
      <div className="w-full flex flex-col items-center gap-2 pt-2 text-xs">
        <p className="text-muted-foreground text-center">
          Sudah memiliki akun?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
          >
            Masuk di sini
          </Link>
        </p>

        <Link
          href="/"
          className="text-muted-foreground hover:text-primary text-center hover:underline underline-offset-2 transition-colors"
        >
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
};

export default RegisterSection;
