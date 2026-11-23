"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";
import {
  ArrowLeft,
  Store,
  MapPin,
  Truck,
  AlertCircle,
  ShoppingBag,
  Scale,
  Receipt,
  FileText,
  User,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { useCheckout } from "./useCheckout";
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

// Leaflet map picker dynamically imported with SSR disabled
const DeliveryMapPicker = dynamic(() => import("./DeliveryMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-80 sm:h-96 rounded-2xl bg-muted/40 border animate-pulse flex items-center justify-center text-xs text-muted-foreground">
      Memuat peta pengantaran Karawang...
    </div>
  ),
});

export default function CheckoutSection() {
  const {
    user,
    items,
    deliveryFee,
    deliveryBreakdown,
    isFeeLoading,
    latitude,
    longitude,
    setLatitude,
    setLongitude,
    syncFullAddress,
    subtotalProducts,
    totalAmount,
    isCartLoading,
    isUserLoading,
    isCartError,
    isSubmitting,
    form,
    onSubmit,
  } = useCheckout();

  if (isCartLoading || isUserLoading) {
    return (
      <div className="max-w-5xl mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border/60">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isCartError) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border rounded-2xl text-center space-y-4 bg-card shadow-xs">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold">Gagal Memuat Keranjang</h2>
        <p className="text-sm text-muted-foreground">
          Terjadi kendala saat membaca data belanja. Pastikan sesi login Anda masih aktif.
        </p>
        <Button nativeButton={false} render={<Link href="/user/cart" />}>
          Kembali ke Keranjang
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border rounded-2xl text-center space-y-4 bg-card shadow-xs">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold">Keranjang Belanja Kosong</h2>
        <p className="text-sm text-muted-foreground">
          Pilih komoditas segar di katalog pasar terlebih dahulu sebelum melakukan checkout.
        </p>
        <Button nativeButton={false} render={<Link href="/" />}>
          Mulai Belanja
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 pb-28 lg:pb-10">
      {/* Header Halaman & Breadcrumb Stepper */}
      <div className="mb-6 space-y-3 pb-4 border-b border-border/60">
        {/* Step Progress Indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground overflow-x-auto pb-1 scrollbar-none">
          <Link
            href="/user/cart"
            className="flex items-center gap-1.5 hover:text-primary transition-colors font-medium shrink-0"
          >
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
              ✓
            </span>
            Keranjang
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
          <span className="flex items-center gap-1.5 text-primary font-semibold shrink-0">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-xs">
              2
            </span>
            Pengiriman & Alamat
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
          <span className="flex items-center gap-1.5 opacity-50 shrink-0">
            <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            Pembayaran
          </span>
        </div>

        {/* Title Bar */}
        <div className="flex items-center gap-3">
          <Link
            href="/user/cart"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center shrink-0 transition-colors shadow-xs active:scale-95"
            aria-label="Kembali ke keranjang"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Checkout Pesanan Pasar
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Tentukan titik pengantaran langsung di Karawang dan lengkapi rincian kontak penerima
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-full min-w-0">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start w-full max-w-full min-w-0">
          {/* Kolom Kiri: Formulir Pengiriman & Daftar Komoditas */}
          <div className="lg:col-span-2 space-y-6 w-full max-w-full min-w-0">
            {/* Bagian 1: Peta Interaktif Geser Titik */}
            <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card space-y-4 shadow-xs overflow-hidden w-full max-w-full min-w-0">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                      1. Titik Pengantaran Peta (Geser Peta)
                    </h2>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      Arahkan pin pada peta persis ke lokasi rumah, kios, atau warung Anda
                    </p>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground shrink-0 hidden sm:inline-block">
                  OSRM Karawang
                </span>
              </div>

              {/* Komponen Peta Geser Interaktif */}
              <DeliveryMapPicker
                latitude={latitude}
                longitude={longitude}
                onChange={(lat, lng, name) => {
                  setLatitude(lat);
                  setLongitude(lng);
                  if (name && !form.getValues("street_address")) {
                    form.setValue("street_address", name);
                    syncFullAddress();
                  }
                }}
                onAddressSelect={(name) => {
                  form.setValue("street_address", name);
                  syncFullAddress();
                }}
                initialLat={user?.profile?.latitude ? Number(user.profile.latitude) : -6.3262}
                initialLng={user?.profile?.longitude ? Number(user.profile.longitude) : 107.3045}
              />
            </div>

            {/* Bagian 2: Formulir Rincian Alamat & Kontak */}
            <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card space-y-4 shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                    2. Rincian Kontak &amp; Alamat Penerima
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    Lengkapi nomor telepon dan detail alamat agar kurir tidak tersesat
                  </p>
                </div>
              </div>

              {/* Penerima & Kontak */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Controller
                  name="recipient_name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="recipient_name">Nama Penerima / Kontak</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          id="recipient_name"
                          placeholder="Contoh: Ibu Dewi / Pak Haji Slamet"
                          disabled={isSubmitting}
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
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phone">Nomor Telepon / WhatsApp</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          id="phone"
                          type="tel"
                          placeholder="08xxxxxxxxxx (Aktif WhatsApp)"
                          disabled={isSubmitting}
                        />
                      </FieldContent>
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>

              {/* Nama Usaha / Warung (Opsional) */}
              <Controller
                name="store_name"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="store_name">Nama Kios / Warung / Toko (Opsional)</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="store_name"
                        placeholder="Contoh: Warung Sayur Bu Dewi / Kios Berkah"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          field.onChange(e);
                          syncFullAddress();
                        }}
                      />
                    </FieldContent>
                  </Field>
                )}
              />

              {/* Rincian Alamat: Nama Jalan & Nomor Bangunan */}
              <Controller
                name="street_address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="street_address">
                      Nama Jalan / Gang &amp; Nomor Bangunan <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="street_address"
                        placeholder="Contoh: Jl. HS Ronggowaluyo No. 45 / Gang H. Sholeh No. 12"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          field.onChange(e);
                          syncFullAddress();
                        }}
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Blok/Kios & Kecamatan */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Controller
                  name="block_number"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="block_number">Nomor Blok / Kios / RT / RW (Opsional)</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          id="block_number"
                          placeholder="Contoh: Blok B-14 No. 4 / RT 03 RW 05"
                          disabled={isSubmitting}
                          onChange={(e) => {
                            field.onChange(e);
                            syncFullAddress();
                          }}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />

                <Controller
                  name="district"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="district">Kecamatan / Kelurahan (Opsional)</FieldLabel>
                      <FieldContent>
                        <Input
                          {...field}
                          id="district"
                          placeholder="Contoh: Telukjambe Timur / Karawang Barat"
                          disabled={isSubmitting}
                          onChange={(e) => {
                            field.onChange(e);
                            syncFullAddress();
                          }}
                        />
                      </FieldContent>
                    </Field>
                  )}
                />
              </div>

              {/* Patokan Terdekat (Landmark) */}
              <Controller
                name="landmark"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="landmark">Patokan Lokasi Terdekat (Landmark)</FieldLabel>
                    <FieldContent>
                      <Input
                        {...field}
                        id="landmark"
                        placeholder="Contoh: Depan Masjid Al-Ikhlas / Samping Indomaret / Pagar Hitam"
                        disabled={isSubmitting}
                        onChange={(e) => {
                          field.onChange(e);
                          syncFullAddress();
                        }}
                      />
                    </FieldContent>
                  </Field>
                )}
              />

              {/* Alamat Lengkap Gabungan (Preview & Final Edit) */}
              <Controller
                name="full_address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="full_address">
                      Alamat Lengkap Pengiriman (Tercetak di Surat Jalan Kurir) <span className="text-destructive">*</span>
                    </FieldLabel>
                    <FieldContent>
                      <Textarea
                        {...field}
                        id="full_address"
                        rows={3}
                        placeholder="Alamat lengkap gabungan yang akan dibaca oleh kurir pengantar..."
                        disabled={isSubmitting}
                      />
                    </FieldContent>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Bagian 3: Rincian Komoditas Dipesan */}
            <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                      3. Rincian Komoditas ({items.length} Item)
                    </h2>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">
                      Komoditas segar disiapkan langsung dari lapak pedagang pasar
                    </p>
                  </div>
                </div>
                <Link
                  href="/user/cart"
                  className="text-xs text-primary hover:underline font-medium shrink-0"
                >
                  Ubah Keranjang
                </Link>
              </div>

              <div className="divide-y divide-border/50">
                {items.map((item) => {
                  const p = item.product;
                  const storeName =
                    p?.seller?.profile?.store_name || p?.seller?.name || "Kios Pedagang";
                  const blockNumber = p?.seller?.profile?.block_number;

                  return (
                    <div
                      key={item.id}
                      className="py-3 sm:py-3.5 flex items-center justify-between gap-3.5"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-muted border border-border/50">
                          <Image
                            src={p?.image_url || "/test.jpg"}
                            alt={p?.name || "Komoditas"}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-xs sm:text-sm text-foreground truncate">
                            {p?.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                            <Store className="w-3 h-3 shrink-0 text-primary" />
                            <span className="truncate">{storeName}</span>
                            {blockNumber && (
                              <span className="text-muted-foreground/70">({blockNumber})</span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {item.quantity} {p?.unit} &times; {p?.formatted_price}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-xs sm:text-sm text-foreground">
                          Rp {(item.quantity * (p?.price || 0)).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bagian 4: Catatan Khusus Kurir & Kios */}
            <div className="p-4 sm:p-5 border border-border rounded-2xl bg-card space-y-3 shadow-xs">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm sm:text-base text-foreground leading-snug">
                    4. Catatan Pesanan (Opsional)
                  </h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">
                    Instruksi khusus terkait waktu pengantaran atau spesifikasi komoditas
                  </p>
                </div>
              </div>
              <Controller
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="notes"
                    rows={2}
                    placeholder="Contoh: Tolong pilihkan cabai kering, mohon sampai sebelum jam 06.00 pagi."
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Tagihan & Ongkir OSRM */}
          <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6">
            <div className="border border-border rounded-2xl p-4 sm:p-5 bg-card space-y-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-border/60">
                <Receipt className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-base text-foreground">Ringkasan Tagihan</h2>
              </div>

              {/* Rincian Ongkir Dinamis OSRM & Bobot */}
              {deliveryBreakdown && (
                <div className="p-3.5 bg-muted/40 rounded-xl border border-border/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Kalkulasi Rute Karawang
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {deliveryBreakdown.routing_source === "osrm_live"
                        ? "OSRM Live"
                        : "Karawang Matrix"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-border/60">
                    <div className="p-1.5 bg-background rounded-lg border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">Jarak</span>
                      <strong className="text-xs font-bold text-foreground">
                        {deliveryBreakdown.distance_km} km
                      </strong>
                    </div>
                    <div className="p-1.5 bg-background rounded-lg border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">Muatan</span>
                      <strong className="text-xs font-bold text-foreground flex items-center justify-center gap-0.5">
                        <Scale className="w-3 h-3 text-muted-foreground" />
                        {deliveryBreakdown.estimated_weight_kg} kg
                      </strong>
                    </div>
                    <div className="p-1.5 bg-background rounded-lg border border-border/60">
                      <span className="text-[10px] text-muted-foreground block">Kios</span>
                      <strong className="text-xs font-bold text-foreground">
                        {deliveryBreakdown.stall_count} Lapak
                      </strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted-foreground space-y-1 pt-1 border-t border-border/50">
                    <div className="flex justify-between">
                      <span>Tarif Dasar (0-2 km):</span>
                      <span className="font-medium text-foreground">
                        Rp {deliveryBreakdown.base_fee.toLocaleString("id-ID")}
                      </span>
                    </div>
                    {deliveryBreakdown.distance_fee > 0 && (
                      <div className="flex justify-between">
                        <span>
                          Tambahan Jarak ({Math.max(0, deliveryBreakdown.distance_km - 2).toFixed(1)} km):
                        </span>
                        <span className="font-medium text-foreground">
                          +Rp {deliveryBreakdown.distance_fee.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                    {deliveryBreakdown.weight_fee > 0 && (
                      <div className="flex justify-between text-amber-700 dark:text-amber-400">
                        <span>Surcharge Muatan ({deliveryBreakdown.estimated_weight_kg} kg):</span>
                        <span className="font-medium">
                          +Rp {deliveryBreakdown.weight_fee.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                    {deliveryBreakdown.multi_stall_fee > 0 && (
                      <div className="flex justify-between text-blue-700 dark:text-blue-400">
                        <span>Insentif Multi-Kios ({deliveryBreakdown.stall_count} Kios):</span>
                        <span className="font-medium">
                          +Rp {deliveryBreakdown.multi_stall_fee.toLocaleString("id-ID")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Rincian Harga */}
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal Komoditas:</span>
                  <span className="font-medium text-foreground">
                    Rp {subtotalProducts.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    Ongkos Kirim Pasar:
                  </span>
                  <span className="font-medium text-foreground flex items-center gap-1">
                    {isFeeLoading && <Spinner className="w-3 h-3 text-muted-foreground" />}
                    Rp {deliveryFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="border-t border-border/60 pt-3 flex justify-between items-baseline font-bold">
                  <span className="text-sm sm:text-base text-foreground">Total Tagihan:</span>
                  <span className="text-xl sm:text-2xl font-black text-primary">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Info Garansi Segar */}
              <div className="p-3 bg-muted/40 rounded-xl border border-border/60 text-xs text-muted-foreground flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground text-xs">Jaminan Mutu Pasar</p>
                  <p className="text-[11px] leading-relaxed">
                    Pesanan langsung diteruskan ke kios lapak pedagang pasar induk dan diantar kurir lokal.
                  </p>
                </div>
              </div>

              {/* Desktop Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full text-base font-bold h-12 shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 w-4 h-4" />
                    Memproses Pesanan...
                  </>
                ) : (
                  "Buat Pesanan Sekarang"
                )}
              </Button>

              <p className="text-[11px] text-muted-foreground text-center leading-normal">
                Dengan melanjutkan, Anda mengonfirmasi daftar komoditas dan alamat pengiriman di atas sudah benar.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-background/95 backdrop-blur-md border-t border-border z-30 shadow-lg">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-muted-foreground block leading-none mb-1">
                Total Tagihan ({items.length} item)
              </span>
              <span className="text-base sm:text-lg font-extrabold text-primary leading-tight">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              type="submit"
              size="default"
              disabled={isSubmitting}
              className="font-bold px-5 h-10 sm:h-11 shadow-xs cursor-pointer shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-1.5 w-4 h-4" />
                  Memproses...
                </>
              ) : (
                "Buat Pesanan"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
