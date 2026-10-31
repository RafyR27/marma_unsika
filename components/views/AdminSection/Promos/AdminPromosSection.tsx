"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TicketPercent,
  Plus,
  Tag,
  Calendar,
  Users,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

import { useMe } from "@/hooks/useMe";
import { useAdminPromos } from "./useAdminPromos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminPromosSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    promos,
    isCreateModalOpen,
    setIsCreateModalOpen,
    code,
    setCode,
    title,
    setTitle,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    minSpend,
    setMinSpend,
    quota,
    setQuota,
    expiresAt,
    setExpiresAt,
    togglePromoStatus,
    handleCreatePromo,
  } = useAdminPromos();

  const copyCode = (codeStr: string) => {
    navigator.clipboard.writeText(codeStr);
    toast.success(`Kode voucher ${codeStr} berhasil disalin`, {
      position: "top-right",
    });
  };

  if (!mounted || isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-12 border rounded-xl bg-card">
        <ShieldAlert className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-xl font-bold">Akses Khusus Administrator</h2>
        <p className="text-sm text-muted-foreground">
          Pengaturan voucher dan subsidi operasional pasar hanya dapat diakses oleh tim pengelola.
        </p>
        <Button onClick={() => router.push("/auth/login")}>
          Masuk sebagai Admin
        </Button>
      </div>
    );
  }

  const activeCount = promos.filter((p) => p.isActive).length;
  const totalUsed = promos.reduce((sum, p) => sum + p.used, 0);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <TicketPercent className="w-6 h-6 text-primary" />
            Promo & Voucher Subsidi Pasar
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola kupon diskon ongkos kirim dan potongan harga grosir untuk memicu transaksi warung pembeli.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 font-semibold text-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Terbitkan Voucher Baru
        </Button>
      </div>

      {/* 3 Kartu Metrik Voucher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Total Voucher Terbit</span>
            <Tag className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{promos.length}</p>
          <span className="text-[11px] text-muted-foreground block">
            {activeCount} kupon sedang aktif
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1 border-primary/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-primary">Klaim Digunakan Warung</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-extrabold text-primary">{totalUsed}</p>
          <span className="text-[11px] text-muted-foreground block">
            Total pemakaian voucher
          </span>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">Status Subsidi Pasar</span>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">Aktif Berjalan</p>
          <span className="text-[11px] text-muted-foreground block">
            Alokasi subsidi ongkir tersedia
          </span>
        </div>
      </div>

      {/* Grid Kartu Voucher */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((p) => {
          const isExpired = new Date(p.expiresAt) < new Date();

          return (
            <div
              key={p.id}
              className={`border-2 rounded-2xl p-5 bg-card shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                p.isActive && !isExpired
                  ? "border-primary/40 hover:border-primary"
                  : "border-border opacity-70"
              }`}
            >
              <div className="space-y-3">
                {/* Kode Voucher & Tombol Salin */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b">
                  <span className="font-mono text-sm font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-lg tracking-wider">
                    {p.code}
                  </span>
                  <button
                    onClick={() => copyCode(p.code)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                    title="Salin Kode"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-foreground leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs text-primary font-semibold">
                    {p.discountType === "free_shipping"
                      ? `Potongan Ongkir Rp ${p.discountValue.toLocaleString("id-ID")}`
                      : p.discountType === "fixed"
                      ? `Diskon Langsung Rp ${p.discountValue.toLocaleString("id-ID")}`
                      : `Diskon ${p.discountValue}% (Maks Rp ${p.maxDiscount?.toLocaleString("id-ID")})`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Minimal belanja: Rp {p.minSpend.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Progress Kuota */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Kuota Terpakai:</span>
                    <span>
                      {p.used} / {p.quota} klaim
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, (p.used / p.quota) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Berlaku hingga: {p.expiresAt}</span>
                </div>
              </div>

              {/* Footer Toggle Status */}
              <div className="pt-3 border-t flex items-center justify-between text-xs">
                <span
                  className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                    p.isActive && !isExpired
                      ? "bg-green-500/10 text-green-700"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {isExpired ? "Kadaluarsa" : p.isActive ? "Aktif" : "Nonaktif"}
                </span>

                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => togglePromoStatus(p.id)}
                  className="text-xs"
                >
                  {p.isActive ? "Nonaktifkan" : "Aktifkan"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL TERBITKAN VOUCHER BARU */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <TicketPercent className="w-5 h-5 text-primary" />
              Terbitkan Voucher Subsidi Baru
            </DialogTitle>
            <DialogDescription className="text-xs">
              Buat kupon promo untuk pembeli warung dalam ekosistem Pasar Makar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePromo} className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Kode Kupon:</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: PASAR-SEGAR-2026"
                className="font-mono font-bold tracking-wider"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Judul Promo:</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Subsidi Bebas Ongkir Karawang"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Tipe Diskon:</label>
                <select
                  value={discountType}
                  onChange={(e) =>
                    setDiscountType(
                      e.target.value as "percent" | "fixed" | "free_shipping"
                    )
                  }
                  className="w-full h-9 px-3 rounded-lg border border-input bg-background outline-none text-xs focus:border-ring cursor-pointer"
                >
                  <option value="free_shipping">Subsidi Ongkir</option>
                  <option value="fixed">Potongan Nominal (Rp)</option>
                  <option value="percent">Persentase (%)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Nilai Potongan:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Minimal Belanja (Rp):
                </label>
                <Input
                  type="number"
                  min="0"
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Kuota Maksimal:
                </label>
                <Input
                  type="number"
                  min="1"
                  value={quota}
                  onChange={(e) => setQuota(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">
                Masa Berlaku Hingga:
              </label>
              <Input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" className="font-semibold">
                Terbitkan Kupon
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
