"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Store,
  Truck,
  Compass,
  Clock,
  Navigation,
  ShieldAlert,
  Layers,
  CheckCircle2,
  Phone,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useCourierServiceArea } from "./useCourierServiceArea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourierServiceAreaSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    marketHubZones,
    deliveryCoverageZones,
    selectedHub,
    setSelectedHub,
  } = useCourierServiceArea();

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const isCourier = user?.role === "courier" || user?.role === "admin";
  if (!isCourier) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Kurir Lapangan</h2>
        <p className="text-sm text-muted-foreground">
          Peta denah blok pasar dan panduan area rute layanan hanya dapat diakses oleh kurir resmi pasar.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Kurir
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          Peta Area Layanan & Denah Blok Pasar
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Panduan navigasi penjemputan barang di blok kios pasar induk dan zonasi pengantaran warung pemesan.
        </p>
      </div>

      {/* 2 Seksi Utama */}
      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Kolom 1: Denah Blok Penjemputan di Pasar Induk */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Zonasi Blok Kios Pasar Induk</h2>
            </div>
            <span className="text-xs text-muted-foreground">Titik Penjemputan</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Klik blok kios untuk melihat rincian komoditas dan titik kumpul armada sebelum mengangkut muatan:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {marketHubZones.map((hub) => {
              const isSelected = hub.code === selectedHub;

              return (
                <div
                  key={hub.code}
                  onClick={() => setSelectedHub(hub.code)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "hover:border-primary/50 bg-background"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-primary block">
                    {hub.code}
                  </span>
                  <p className="font-bold text-xs text-foreground leading-snug">
                    {hub.commodityType}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {hub.totalStalls} Kios Terdaftar
                  </p>
                </div>
              );
            })}
          </div>

          {/* Rincian Blok yang Dipilih */}
          {(() => {
            const current = marketHubZones.find((h) => h.code === selectedHub);
            if (!current) return null;

            return (
              <div className="p-4 rounded-xl border bg-muted/30 space-y-2 text-xs">
                <span className="font-bold text-sm text-foreground block">
                  {current.name}
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  {current.description}
                </p>
                <div className="pt-2 border-t flex items-center justify-between font-medium">
                  <span className="text-muted-foreground">Pos Parkir / Titik Muat:</span>
                  <span className="text-primary font-bold">{current.pickupHub}</span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Kolom 2: Jangkauan Pengantaran Warung Pembeli */}
        <div className="p-5 border rounded-xl bg-card space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Jangkauan Pengantaran Warung</h2>
            </div>
            <span className="text-xs text-green-600 font-semibold">Aktif 24 Jam</span>
          </div>

          <div className="space-y-3">
            {deliveryCoverageZones.map((zone, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border bg-card shadow-xs space-y-2 text-xs hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">
                    {zone.zoneName}
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {zone.deliveryFee}
                  </span>
                </div>

                <p className="text-muted-foreground">
                  Cakupan: <strong className="text-foreground">{zone.coverage}</strong>
                </p>

                <div className="flex items-center justify-between pt-1 border-t text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    Waktu Tempuh: {zone.estimatedTransitTime}
                  </span>
                  <span>{zone.activeStalls} Warung Langganan</span>
                </div>
              </div>
            ))}
          </div>

          {/* SOP Subuh Armada Kurir */}
          <div className="p-4 rounded-xl border bg-primary/5 space-y-2 text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              SOP Pengantaran Subuh Armada Pasar
            </span>
            <ul className="text-muted-foreground space-y-1 list-disc pl-5 text-[11px]">
              <li>Jam penjemputan barang subuh dimulai pukul 03.30 WIB di pos timbangan barat.</li>
              <li>Wajib memeriksa kesesuaian fisik komoditas dengan checklist di aplikasi.</li>
              <li>Minta tanda tangan / konfirmasi uang tunai jika pesanan berstatus COD.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
