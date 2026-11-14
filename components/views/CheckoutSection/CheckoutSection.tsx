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
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isCartError) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border rounded-xl text-center space-y-4 bg-card">
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
      <div className="max-w-md mx-auto my-16 p-8 border rounded-xl text-center space-y-4 bg-card">
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Header Halaman */}
      <div className="mb-6">
        <Link
          href="/user/cart"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Keranjang
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Checkout Pesanan Grosir</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Geser peta untuk menentukan titik pengantaran langsung di Karawang dan lengkapi rincian alamat penerima.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Kolom Kiri: Peta Geser & Alamat Rinci */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bagian 1: Peta Interaktif Geser Titik (Grab/Gojek Map Dropper) */}
            <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-bold text-base">Titik Pengantaran Peta (Geser Peta)</h2>
                </div>
                <span className="text-xs text-muted-foreground">Router OSRM Karawang</span>
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

            {/* Bagian 2: Formulir Rincian Alamat Rumah/Kios */}
            <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
              <div className="pb-3 border-b">
                <h2 className="font-bold text-base">Rincian Alamat &amp; Kontak Penerima</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Lengkapi nomor rumah, nama jalan, blok kios, atau patokan agar kurir tidak tersesat.
                </p>
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
                          placeholder="Contoh: Blok B-14 No. 4 / RT 03 RW 05 / Kios No. 08"
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
                          placeholder="Contoh: Telukjambe Timur / Karawang Barat / Klari"
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

            {/* Bagian 3: Catatan Khusus Kurir */}
            <div className="p-5 border rounded-xl bg-card space-y-3">
              <FieldLabel htmlFor="notes">Catatan Pesanan untuk Kios &amp; Kurir (Opsional)</FieldLabel>
              <Controller
                name="notes"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="notes"
                    rows={2}
                    placeholder="Contoh: Tolong pilihkan cabai kering, mohon sampai sebelum subuh jam 05.00."
                    disabled={isSubmitting}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">
                Instruksi khusus terkait waktu pengantaran atau spesifikasi penanganan komoditas segar.
              </p>
            </div>

            {/* Bagian 4: Rincian Barang Dipesan */}
            <div className="p-5 border rounded-xl bg-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-base">Rincian Komoditas ({items.length} Item)</h2>
                </div>
                <span className="text-xs text-muted-foreground">Pasar Induk Multi-Kios</span>
              </div>

              <div className="divide-y">
                {items.map((item) => {
                  const p = item.product;
                  const storeName =
                    p?.seller?.profile?.store_name || p?.seller?.name || "Kios Pedagang";
                  const blockNumber = p?.seller?.profile?.block_number;

                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-muted border">
                          <Image
                            src={p?.image_url || "/test.jpg"}
                            alt={p?.name || "Komoditas"}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{p?.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate mt-0.5">
                            <span>{storeName}</span>
                            {blockNumber && <span>({blockNumber})</span>}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.quantity} {p?.unit} x {p?.formatted_price}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 font-semibold text-sm">
                        Rp {(item.quantity * (p?.price || 0)).toLocaleString("id-ID")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Ringkasan Tagihan & Breakdown Ongkir Dinamis */}
          <div className="lg:col-span-1 space-y-4 sticky top-6">
            <div className="border rounded-xl p-5 bg-card space-y-5 shadow-xs">
              <h2 className="font-bold text-base pb-3 border-b">Ringkasan Tagihan</h2>

              {/* Rincian Ongkir Dinamis OSRM & Bobot */}
              {deliveryBreakdown && (
                <div className="p-3.5 bg-muted/40 rounded-xl border border-border/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Kalkulasi Rute Karawang
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {deliveryBreakdown.routing_source === "osrm_live" ? "OSRM Live" : "Karawang Matrix"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-border/60">
                    <div className="p-1.5 bg-background rounded-lg border">
                      <span className="text-[10px] text-muted-foreground block">Jarak</span>
                      <strong className="text-xs font-bold text-foreground">
                        {deliveryBreakdown.distance_km} km
                      </strong>
                    </div>
                    <div className="p-1.5 bg-background rounded-lg border">
                      <span className="text-[10px] text-muted-foreground block">Muatan</span>
                      <strong className="text-xs font-bold text-foreground flex items-center justify-center gap-0.5">
                        <Scale className="w-3 h-3 text-muted-foreground" />
                        {deliveryBreakdown.estimated_weight_kg} kg
                      </strong>
                    </div>
                    <div className="p-1.5 bg-background rounded-lg border">
                      <span className="text-[10px] text-muted-foreground block">Kios</span>
                      <strong className="text-xs font-bold text-foreground">
                        {deliveryBreakdown.stall_count} Lapak
                      </strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-muted-foreground space-y-1 pt-1 border-t border-border/50">
                    <div className="flex justify-between">
                      <span>Tarif Dasar (0-2 km):</span>
                      <span>Rp {deliveryBreakdown.base_fee.toLocaleString("id-ID")}</span>
                    </div>
                    {deliveryBreakdown.distance_fee > 0 && (
                      <div className="flex justify-between">
                        <span>Tambahan Jarak ({Math.max(0, deliveryBreakdown.distance_km - 2).toFixed(1)} km):</span>
                        <span>+Rp {deliveryBreakdown.distance_fee.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    {deliveryBreakdown.weight_fee > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>Surcharge Muatan ({deliveryBreakdown.estimated_weight_kg} kg):</span>
                        <span>+Rp {deliveryBreakdown.weight_fee.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                    {deliveryBreakdown.multi_stall_fee > 0 && (
                      <div className="flex justify-between text-blue-700">
                        <span>Insentif Multi-Kios ({deliveryBreakdown.stall_count} Kios):</span>
                        <span>+Rp {deliveryBreakdown.multi_stall_fee.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2.5 text-sm">
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
                <div className="border-t pt-3 flex justify-between items-baseline font-bold text-base">
                  <span>Total Tagihan:</span>
                  <span className="text-xl font-extrabold text-primary">
                    Rp {totalAmount.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Informasi Pemrosesan</p>
                <p>
                  Pesanan akan langsung diteruskan ke masing-masing kios lapak pasar induk untuk disiapkan.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full text-base font-semibold h-11"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
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
      </form>
    </div>
  );
}
