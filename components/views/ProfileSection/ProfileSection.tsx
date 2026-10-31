"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import {
  User,
  Store,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Truck,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  Save,
} from "lucide-react";

import { useProfile } from "./useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function ProfileSection() {
  const {
    currentUser,
    isProfileLoading,
    isError,
    refetch,
    activeTab,
    setActiveTab,
    profileForm,
    onProfileSubmit,
    isUpdatingProfile,
    passwordForm,
    onPasswordSubmit,
    isUpdatingPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  } = useProfile();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isProfileLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const hasToken =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  if (!hasToken) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border rounded-xl text-center space-y-4 bg-card">
        <User className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold">Silakan Masuk Terlebih Dahulu</h2>
        <p className="text-sm text-muted-foreground">
          Masuk ke akun Anda untuk melihat dan memperbarui informasi profil lapak dan pengaturan akun.
        </p>
        <Button nativeButton={false} render={<Link href="/auth/login" className="px-6" />}>
          Masuk Sekarang
        </Button>
      </div>
    );
  }

  if (isError || !currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border rounded-xl text-center space-y-3 bg-card">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-base font-bold">Gagal Mengambil Data Profil</h2>
        <p className="text-xs text-muted-foreground">
          Terjadi kendala saat membaca data akun Anda dari server.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  const p = currentUser.profile;
  const role = currentUser.role;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      {/* Header Profil & Ringkasan Peran */}
      <div className="p-5 border rounded-xl bg-card shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0 border border-primary/20">
            {role === "seller" ? (
              <Store className="w-6 h-6" />
            ) : role === "courier" ? (
              <Truck className="w-6 h-6" />
            ) : role === "admin" ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <ShoppingBag className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {currentUser.name}
              </h1>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {role === "seller"
                  ? "Mitra Pedagang"
                  : role === "courier"
                  ? "Kurir Lapangan"
                  : role === "admin"
                  ? "Admin Pengelola"
                  : "Pembeli Warung"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentUser.phone} {currentUser.email ? `· ${currentUser.email}` : ""}
            </p>
            {p?.store_name && (
              <p className="text-xs font-semibold text-primary mt-1">
                Lapak: {p.store_name} {p.market_name ? `(${p.market_name})` : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Menu Profil */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === "profile"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          <span>Informasi Lapak & Kontak</span>
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-px ${
            activeTab === "password"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Keamanan & Kata Sandi</span>
        </button>
      </div>

      {/* TAB 1: FORM INFORMASI LAPAK & KONTAK */}
      {activeTab === "profile" && (
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
          <div className="p-6 border rounded-xl bg-card space-y-5 shadow-xs">
            <div className="space-y-1 pb-3 border-b">
              <h2 className="font-bold text-base text-foreground">
                Data Pribadi & Kontak
              </h2>
              <p className="text-xs text-muted-foreground">
                Informasi ini digunakan dalam faktur pesanan dan koordinasi penjemputan barang.
              </p>
            </div>

            {/* Nama & No. HP */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Controller
                name="name"
                control={profileForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-name">Nama Lengkap</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="profile-name"
                        placeholder="Nama penanggung jawab"
                        disabled={isUpdatingProfile}
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="phone"
                control={profileForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="profile-phone">Nomor Telepon / WhatsApp</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="profile-phone"
                        type="tel"
                        disabled={isUpdatingProfile}
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Email */}
            <Controller
              name="email"
              control={profileForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="profile-email">Alamat Email (Opsional)</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      id="profile-email"
                      type="email"
                      placeholder="nama@domain.com"
                      disabled={isUpdatingProfile}
                    />
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Bagian Identitas Toko/Warung */}
            <div className="space-y-1 pt-4 pb-2 border-b">
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                Identitas Toko, Kios, atau Warung
              </h2>
              <p className="text-xs text-muted-foreground">
                Khusus pedagang pasar induk atau pemilik warung pembeli.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Controller
                name="store_name"
                control={profileForm.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="profile-store">Nama Kios / Warung</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="profile-store"
                        placeholder="Contoh: UD Berkah Cabai Segar"
                        disabled={isUpdatingProfile}
                      />
                    </FieldContent>
                  </Field>
                )}
              />

              <Controller
                name="market_name"
                control={profileForm.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="profile-market">Nama Pasar Induk / Wilayah</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="profile-market"
                        placeholder="Contoh: Pasar Induk Kramat Jati"
                        disabled={isUpdatingProfile}
                      />
                    </FieldContent>
                  </Field>
                )}
              />
            </div>

            <Controller
              name="block_number"
              control={profileForm.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile-block">Nomor Blok / Kios Lapak</FieldLabel>
                  <FieldContent>
                    <Input
                      {...field}
                      id="profile-block"
                      placeholder="Contoh: Blok B-1 No. 45-48"
                      disabled={isUpdatingProfile}
                    />
                  </FieldContent>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Sangat penting bagi kurir untuk menemukan titik lapak Anda dengan cepat.
                  </p>
                </Field>
              )}
            />

            <Controller
              name="full_address"
              control={profileForm.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="profile-address">Alamat Lengkap</FieldLabel>
                  <FieldContent>
                    <Textarea
                      {...field}
                      id="profile-address"
                      rows={3}
                      placeholder="Alamat jalan lengkap, patokan kios, nomor gedung"
                      disabled={isUpdatingProfile}
                    />
                  </FieldContent>
                </Field>
              )}
            />

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="font-semibold text-xs h-10 px-6"
              >
                {isUpdatingProfile ? (
                  <>
                    <Spinner className="mr-1.5" />
                    Menyimpan Perubahan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    Simpan Profil Lapak
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: FORM GANTI PASSWORD */}
      {activeTab === "password" && (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <div className="p-6 border rounded-xl bg-card space-y-5 shadow-xs">
            <div className="space-y-1 pb-3 border-b">
              <h2 className="font-bold text-base text-foreground">
                Ubah Kata Sandi Akun
              </h2>
              <p className="text-xs text-muted-foreground">
                Gunakan kata sandi yang kuat minimal 8 karakter untuk mengamankan akses akun Anda.
              </p>
            </div>

            {/* Password Lama */}
            <Controller
              name="current_password"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="current_password">Kata Sandi Saat Ini</FieldLabel>
                  <FieldContent>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        {...field}
                        id="current_password"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Masukkan kata sandi saat ini"
                        disabled={isUpdatingPassword}
                      />
                      <InputGroupAddon align="inline-end">
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Password Baru */}
            <Controller
              name="password"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Kata Sandi Baru</FieldLabel>
                  <FieldContent>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        {...field}
                        id="password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        disabled={isUpdatingPassword}
                      />
                      <InputGroupAddon align="inline-end">
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            {/* Konfirmasi Password Baru */}
            <Controller
              name="password_confirmation"
              control={passwordForm.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password_confirmation">
                    Konfirmasi Kata Sandi Baru
                  </FieldLabel>
                  <FieldContent>
                    <InputGroup className="bg-background">
                      <InputGroupInput
                        {...field}
                        id="password_confirmation"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Ulangi kata sandi baru"
                        disabled={isUpdatingPassword}
                      />
                      <InputGroupAddon align="inline-end">
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </InputGroupAddon>
                    </InputGroup>
                  </FieldContent>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isUpdatingPassword}
                className="font-semibold text-xs h-10 px-6"
              >
                {isUpdatingPassword ? (
                  <>
                    <Spinner className="mr-1.5" />
                    Memperbarui Sandi...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-1.5" />
                    Perbarui Kata Sandi
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
