"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Banknote,
  Building2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Copy,
  Receipt,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

import { usePayment } from "./usePayment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { FieldLabel } from "@/components/ui/field";

interface PaymentSectionProps {
  orderNumber: string;
}

export default function PaymentSection({ orderNumber }: PaymentSectionProps) {
  const {
    currentOrder,
    isOrderLoading,
    isOrderError,
    refetchOrder,
    paymentMethod,
    setPaymentMethod,
    proofPreview,
    handleFileChange,
    externalReferenceId,
    setExternalReferenceId,
    isSubmitting,
    handleSubmit,
  } = usePayment(orderNumber);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin`, { position: "top-right" });
  };

  if (isOrderLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-72" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="md:col-span-2 h-96 rounded-xl" />
          <Skeleton className="md:col-span-1 h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isOrderError || !currentOrder) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border rounded-xl text-center space-y-4 bg-card">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold">Pesanan Tidak Ditemukan</h2>
        <p className="text-sm text-muted-foreground">
          Nomor pesanan &quot;{orderNumber}&quot; tidak terdaftar atau Anda tidak memiliki akses ke pesanan ini.
        </p>
        <div className="flex justify-center gap-2 pt-2">
          <Button variant="outline" onClick={() => refetchOrder()}>
            Coba Lagi
          </Button>
          <Button nativeButton={false} render={<Link href="/user/orders" />}>
            Daftar Pesanan
          </Button>
        </div>
      </div>
    );
  }

  const isAlreadyPaid = currentOrder.payment_status === "paid";
  const isCancelled = currentOrder.order_status === "cancelled";
  const hasSubmittedProof =
    currentOrder.payment?.payment_method === "manual_transfer" &&
    !isAlreadyPaid &&
    !!currentOrder.payment?.payment_proof_url;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Navigasi Balik */}
      <div className="mb-6">
        <Link
          href={`/user/orders/${orderNumber}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Detail Pesanan
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Pembayaran Pesanan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Selesaikan pembayaran untuk pesanan nomor <strong className="text-foreground">{orderNumber}</strong>
        </p>
      </div>

      {/* Kondisi Khusus: Sudah Lunas */}
      {isAlreadyPaid && (
        <div className="p-6 border rounded-xl bg-card text-center space-y-3 mb-6 border-green-500/30 bg-green-500/5">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
          <h2 className="text-lg font-bold text-green-700 dark:text-green-400">
            Pesanan Sudah Lunas
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Pembayaran telah berhasil diverifikasi. Pesanan Anda saat ini sedang diproses oleh pedagang pasar dan kurir.
          </p>
          <div className="pt-2">
            <Button nativeButton={false} render={<Link href={`/user/orders/${orderNumber}`} />}>
              Pantau Pengantaran
            </Button>
          </div>
        </div>
      )}

      {/* Kondisi Khusus: Dibatalkan */}
      {isCancelled && (
        <div className="p-6 border rounded-xl bg-card text-center space-y-3 mb-6 border-destructive/30 bg-destructive/5">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h2 className="text-lg font-bold text-destructive">Pesanan Dibatalkan</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Pesanan ini telah dibatalkan sehingga proses pembayaran dinonaktifkan.
          </p>
          <div className="pt-2">
            <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
              Belanja Ulang
            </Button>
          </div>
        </div>
      )}

      {/* Kondisi Khusus: Menunggu Verifikasi Admin */}
      {hasSubmittedProof && (
        <div className="p-6 border rounded-xl bg-card text-center space-y-3 mb-6 border-amber-500/30 bg-amber-500/5">
          <Clock className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-amber-700 dark:text-amber-400">
            Bukti Transfer Menunggu Verifikasi
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Bukti transfer telah kami terima. Tim operasional pasar sedang memverifikasi dana Anda. Status akan otomatis diperbarui menjadi Terkonfirmasi.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={`/user/orders/${orderNumber}`} />}
            >
              Lihat Status Pesanan
            </Button>
          </div>
        </div>
      )}

      {!isAlreadyPaid && !isCancelled && (
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Bagian Kiri: Pilihan Metode Pembayaran (2 Cols) */}
            <div className="md:col-span-2 space-y-6">
              {/* Selector Metode */}
              <div className="p-5 border rounded-xl bg-card space-y-4">
                <h2 className="font-bold text-base pb-2 border-b">Pilih Metode Pembayaran</h2>

                <div className="space-y-3">
                  {/* Opsi 1: COD */}
                  <label
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">
                          Bayar di Tempat (COD / Cash on Delivery)
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Bayar tunai kepada kurir lapangan pasar saat komoditas tiba dan diperiksa di warung Anda. Pesanan langsung terkonfirmasi untuk disiapkan pedagang.
                      </p>
                    </div>
                  </label>

                  {/* Opsi 2: Transfer Bank Manual */}
                  <label
                    onClick={() => setPaymentMethod("manual_transfer")}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "manual_transfer"
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="manual_transfer"
                      checked={paymentMethod === "manual_transfer"}
                      onChange={() => setPaymentMethod("manual_transfer")}
                      className="mt-1 text-primary focus:ring-primary"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-sm">
                          Transfer Bank Manual
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Transfer ke rekening pengelola pasar induk dan unggah foto struk / tangkapan layar bukti transfer untuk diverifikasi oleh admin.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Rincian Tambahan jika Memilih Transfer Bank */}
              {paymentMethod === "manual_transfer" && (
                <div className="p-5 border rounded-xl bg-card space-y-5">
                  <h3 className="font-bold text-sm pb-2 border-b">
                    Rekening Tujuan Pembayaran Pasar
                  </h3>

                  {/* Kartu Info Rekening */}
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-lg border bg-muted/40 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-foreground">
                        <span>Bank BCA</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("8720192837", "Nomor Rekening BCA")}
                          className="text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <p className="font-mono text-sm font-bold text-primary">8720-192-837</p>
                      <p className="text-muted-foreground">a.n. Pasar Induk Makar UNSIKA</p>
                    </div>

                    <div className="p-3.5 rounded-lg border bg-muted/40 space-y-1.5">
                      <div className="flex items-center justify-between font-semibold text-foreground">
                        <span>Bank Mandiri</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard("1730009821234", "Nomor Rekening Mandiri")}
                          className="text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <p className="font-mono text-sm font-bold text-primary">173-00-0982123-4</p>
                      <p className="text-muted-foreground">a.n. Pasar Induk Makar UNSIKA</p>
                    </div>
                  </div>

                  {/* Upload Form Struk */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <FieldLabel htmlFor="proof-upload">
                        Unggah Foto Bukti Transfer <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="border-2 border-dashed rounded-xl p-4 text-center hover:bg-muted/30 transition-colors">
                        <input
                          id="proof-upload"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                        <label
                          htmlFor="proof-upload"
                          className="cursor-pointer flex flex-col items-center justify-center gap-2"
                        >
                          <Upload className="w-7 h-7 text-muted-foreground" />
                          <span className="text-xs font-semibold text-primary">
                            Klik untuk memilih file foto struk / bukti transfer
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Format JPG, PNG, atau WEBP. Maksimal 2 MB.
                          </span>
                        </label>
                      </div>

                      {proofPreview && (
                        <div className="relative w-36 h-36 rounded-lg overflow-hidden border mt-3 bg-muted">
                          <Image
                            src={proofPreview}
                            alt="Bukti Transfer"
                            fill
                            sizes="144px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <FieldLabel htmlFor="external_reference_id">
                        Nomor Referensi Transaksi Bank (Opsional)
                      </FieldLabel>
                      <Input
                        id="external_reference_id"
                        value={externalReferenceId}
                        onChange={(e) => setExternalReferenceId(e.target.value)}
                        placeholder="Contoh: TRX-BCA-98124 atau nama pengirim"
                        disabled={isSubmitting}
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Membantu mempercepat proses verifikasi oleh tim keuangan pasar.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bagian Kanan: Ringkasan Tagihan & Konfirmasi (1 Col) */}
            <div className="md:col-span-1">
              <div className="border rounded-xl p-5 bg-card space-y-5 sticky top-6 shadow-xs">
                <div className="flex items-center gap-2 pb-3 border-b">
                  <Receipt className="w-4 h-4 text-primary" />
                  <h2 className="font-bold text-base">Rincian Tagihan</h2>
                </div>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>No. Pesanan:</span>
                    <span className="font-mono font-medium text-foreground">
                      {orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Subtotal Komoditas:</span>
                    <span className="font-medium text-foreground">
                      {currentOrder.formatted_subtotal_products}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>Ongkir Pengantaran:</span>
                    <span className="font-medium text-foreground">
                      {currentOrder.formatted_delivery_fee}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between items-baseline font-bold text-base">
                    <span>Total Tagihan:</span>
                    <span className="text-xl font-extrabold text-primary">
                      {currentOrder.formatted_total_amount}
                    </span>
                  </div>
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
                      Memproses...
                    </>
                  ) : paymentMethod === "cod" ? (
                    "Konfirmasi Pesanan COD"
                  ) : (
                    "Kirim Bukti Pembayaran"
                  )}
                </Button>

                <p className="text-[11px] text-muted-foreground text-center leading-normal">
                  {paymentMethod === "cod"
                    ? "Pesanan langsung diproses. Siapkan uang pas saat kurir tiba."
                    : "Pesanan akan dikonfirmasi setelah tim admin memvalidasi transfer."}
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
