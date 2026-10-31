"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Check,
  XCircle,
  Eye,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard,
  Building2,
  Calendar,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAdminVerifikasi, VerificationFilterTab } from "./useAdminVerifikasi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminVerifikasiSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();

  const {
    activeTab,
    setActiveTab,
    page,
    setPage,
    payments,
    meta,
    isLoading,
    isError,
    refetch,
    previewPayment,
    setPreviewPayment,
    rejectingPayment,
    setRejectingPayment,
    rejectReason,
    setRejectReason,
    approvePayment,
    isApproving,
    rejectPayment,
    isRejecting,
  } = useAdminVerifikasi();

  if (isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-xl" />
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
          Halaman verifikasi transfer keuangan hanya dapat diakses oleh akun Tim Operasional Pasar.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Ke Beranda
          </Button>
          <Button onClick={() => router.push("/auth/login")}>
            Masuk sebagai Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Verifikasi Pembayaran Transfer
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Periksa struk transfer bank pembeli untuk mengonfirmasi pesanan ke pedagang pasar induk.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Data
        </Button>
      </div>

      {/* Tabs Filter Status Verifikasi */}
      <div className="flex gap-2 border-b">
        {[
          { key: "unverified", label: "Menunggu Verifikasi" },
          { key: "verified", label: "Sudah Diverifikasi" },
          { key: "all", label: "Semua Transaksi" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as VerificationFilterTab)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === tab.key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Konten Antrean Pembayaran */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal mengambil data verifikasi pembayaran dari server.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : payments.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <ShieldCheck className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Antrean Verifikasi Bersih</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {activeTab === "unverified"
              ? "Tidak ada bukti transfer yang sedang menunggu konfirmasi saat ini."
              : "Belum ada data pembayaran pada kategori filter ini."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => {
            const o = p.order;
            const buyer = o?.buyer;
            const buyerProfile = buyer?.profile;
            const isVerified = !!p.verified_by;
            const isCOD = p.payment_method === "cod";

            return (
              <div
                key={p.id}
                className="p-5 border rounded-xl bg-card shadow-xs hover:border-primary/40 transition-colors space-y-4"
              >
                {/* Header Kartu Pembayaran */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground text-sm">
                      Pesanan #{o?.order_number || p.order_id}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {p.created_at
                        ? new Date(p.created_at).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full ${
                        isVerified
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {isVerified ? "Sudah Diverifikasi" : "Menunggu Verifikasi Admin"}
                    </span>

                    <span className="font-mono font-bold text-base text-primary">
                      {p.formatted_amount_paid}
                    </span>
                  </div>
                </div>

                {/* Konten Detail Pembayaran & Pembeli */}
                <div className="grid md:grid-cols-3 gap-4 text-xs">
                  {/* Info Pembeli */}
                  <div className="space-y-1">
                    <span className="text-muted-foreground block font-medium">
                      Informasi Pembeli Warung:
                    </span>
                    <p className="font-semibold text-foreground text-sm">
                      {buyer?.name || "Pembeli"}
                    </p>
                    {buyerProfile?.store_name && (
                      <p className="text-muted-foreground">{buyerProfile.store_name}</p>
                    )}
                    <p className="text-muted-foreground">Telp: {buyer?.phone}</p>
                  </div>

                  {/* Info Transaksi & Metode */}
                  <div className="space-y-1">
                    <span className="text-muted-foreground block font-medium">
                      Metode & Referensi:
                    </span>
                    <p className="font-semibold text-foreground uppercase">
                      {isCOD ? "Cash on Delivery (COD)" : "Transfer Bank Manual"}
                    </p>
                    {p.external_reference_id && (
                      <p className="text-muted-foreground font-mono">
                        Ref: {p.external_reference_id}
                      </p>
                    )}
                    {p.verifier && (
                      <p className="text-[11px] text-green-600 font-medium">
                        Diverifikasi oleh: {p.verifier.name}
                      </p>
                    )}
                  </div>

                  {/* Pratinjau Struk Transfer */}
                  <div className="space-y-1.5">
                    <span className="text-muted-foreground block font-medium">
                      Bukti Transfer Struk:
                    </span>
                    {p.payment_proof_url ? (
                      <div className="flex items-center gap-2">
                        <div
                          onClick={() => setPreviewPayment(p)}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          <Image
                            src={p.payment_proof_url}
                            alt="Bukti Transfer"
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => setPreviewPayment(p)}
                          className="text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Perbesar Struk
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">
                        {isCOD ? "COD Tunai (Tanpa unggah struk)" : "Belum ada file diunggah"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tombol Aksi Verifikasi (jika belum diverifikasi) */}
                {!isVerified && !isCOD && (
                  <div className="flex items-center justify-end gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isApproving || isRejecting}
                      onClick={() => setRejectingPayment(p)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Tolak Pembayaran
                    </Button>

                    <Button
                      size="sm"
                      disabled={isApproving || isRejecting}
                      onClick={() => approvePayment(p.id)}
                      className="text-xs font-semibold"
                    >
                      {isApproving ? (
                        <Spinner className="mr-1" />
                      ) : (
                        <Check className="w-3.5 h-3.5 mr-1" />
                      )}
                      Setujui (Approve)
                    </Button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Paginasi */}
          {meta && meta.last_page > 1 && (
            <div className="p-3 border rounded-xl flex items-center justify-between text-xs text-muted-foreground bg-card">
              <span>
                Halaman {meta.current_page} dari {meta.last_page} (Total: {meta.total} transaksi)
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={page <= 1}
                  onClick={() => setPage(Math.max(1, page - 1))}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={page >= meta.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: PREVIEW BESAR STRUK TRANSFER */}
      <Dialog
        open={!!previewPayment}
        onOpenChange={(open) => !open && setPreviewPayment(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              Bukti Transfer Pesanan #{previewPayment?.order?.order_number}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pastikan nama pengirim dan nominal transfer sesuai dengan total tagihan{" "}
              <strong className="text-foreground">
                {previewPayment?.formatted_amount_paid}
              </strong>
            </DialogDescription>
          </DialogHeader>

          {previewPayment?.payment_proof_url && (
            <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden border bg-muted my-2">
              <Image
                src={previewPayment.payment_proof_url}
                alt="Foto Struk Transfer"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain"
                unoptimized
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            {!previewPayment?.verified_by && (
              <div className="flex items-center justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = previewPayment;
                    setPreviewPayment(null);
                    setRejectingPayment(current);
                  }}
                  className="text-destructive hover:bg-destructive/10"
                >
                  Tolak Struk
                </Button>

                <Button
                  type="button"
                  size="sm"
                  disabled={isApproving}
                  onClick={() => {
                    if (previewPayment) approvePayment(previewPayment.id);
                  }}
                >
                  {isApproving ? <Spinner className="mr-1" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                  Setujui Dana Masuk
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: TOLAK PEMBAYARAN */}
      <Dialog
        open={!!rejectingPayment}
        onOpenChange={(open) => !open && setRejectingPayment(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2 text-destructive">
              <XCircle className="w-4 h-4" />
              Tolak Pembayaran Pesanan #{rejectingPayment?.order?.order_number}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Pesanan akan dikembalikan ke status Belum Lunas. Masukkan alasan penolakan agar pembeli dapat mengunggah ulang bukti transfer yang benar.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <label className="text-xs font-semibold">Alasan Penolakan:</label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Nominal transfer kurang, struk buram tidak terbaca, rekening pengirim tidak valid."
              rows={3}
              className="text-xs"
              disabled={isRejecting}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isRejecting}
              onClick={() => setRejectingPayment(null)}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isRejecting || !rejectReason.trim()}
              onClick={() => {
                if (rejectingPayment) {
                  rejectPayment({
                    paymentId: rejectingPayment.id,
                    reason: rejectReason,
                  });
                }
              }}
            >
              {isRejecting ? <Spinner className="mr-1" /> : "Kirim Penolakan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
