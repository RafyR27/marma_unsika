"use client";

import { useRouter } from "next/navigation";
import {
  ClipboardList,
  Store,
  MapPin,
  Truck,
  Banknote,
  ShieldAlert,
  RefreshCw,
  AlertCircle,
  CreditCard,
  Clock,
  ArrowRight,
} from "lucide-react";

import { useMe } from "@/hooks/useMe";
import { useAvailableTasks } from "./useAvailableTasks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export default function AvailableTasksSection() {
  const router = useRouter();
  const { data: user, isLoading: isCheckingAuth } = useMe();
  const {
    availableTasks,
    isLoading,
    isError,
    refetch,
    executeClaim,
    isClaiming,
  } = useAvailableTasks();

  if (isCheckingAuth) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
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
          Halaman penugasan pengantaran ini hanya dapat diakses oleh kurir resmi pasar yang terdaftar.
        </p>
        <div className="pt-2 flex justify-center gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Ke Beranda
          </Button>
          <Button onClick={() => router.push("/auth/login")}>
            Masuk sebagai Kurir
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
          <h1 className="text-2xl font-bold tracking-tight">Tugas Pengantaran Tersedia</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Daftar pesanan pasar terkonfirmasi yang siap dijemput di blok kios dan diantar ke warung pembeli.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Perbarui Tugas
        </Button>
      </div>

      {/* Info Status Operasional */}
      <div className="p-3.5 rounded-xl border bg-muted/30 text-xs text-muted-foreground flex items-center justify-between">
        <p>
          Pesanan terverifikasi langsung muncul di bawah. Segera klaim sebelum diambil oleh kurir lain.
        </p>
        <span className="font-semibold text-foreground shrink-0 ml-2">
          Live Refresh 10 Detik
        </span>
      </div>

      {/* Konten Daftar Tugas Tersedia */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 border border-destructive/20 rounded-xl text-center space-y-3 bg-destructive/5">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Gagal memuat tugas pengantaran tersedia.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Coba Lagi
          </Button>
        </div>
      ) : availableTasks.length === 0 ? (
        <div className="p-16 border rounded-xl text-center space-y-3 bg-muted/20">
          <ClipboardList className="w-14 h-14 text-muted-foreground/40 mx-auto" />
          <h3 className="font-semibold text-base">Belum Ada Tugas Tersedia</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Semua pesanan saat ini sudah memiliki kurir atau belum ada pesanan baru yang terkonfirmasi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableTasks.map((t) => {
            const address = t.delivery_address_snapshot;
            const buyerProfile = t.buyer?.profile;
            const isCOD = t.payment?.payment_method === "cod";

            // Hitung kios unik yang harus didatangi
            const uniqueStalls = new Set(
              t.items?.map(
                (item) =>
                  item.seller?.profile?.store_name ||
                  item.seller?.name ||
                  `Kios #${item.seller_id}`
              )
            );

            return (
              <div
                key={t.id}
                className="p-5 border rounded-xl bg-card shadow-xs hover:border-primary/50 transition-colors space-y-4"
              >
                {/* Header Kartu Tugas */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground text-sm">
                      #{t.order_number}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {t.ordered_at
                        ? new Date(t.ordered_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}{" "}
                      WIB
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Badge Metode Bayar */}
                    <span
                      className={`font-semibold px-2.5 py-0.5 rounded-full ${
                        isCOD
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "bg-green-500/10 text-green-700 dark:text-green-400"
                      }`}
                    >
                      {isCOD ? "Tagih Tunai (COD)" : "Transfer Lunas"}
                    </span>

                    {/* Pendapatan Ongkir Kurir */}
                    <span className="font-bold text-sm text-primary">
                      Ongkir: {t.formatted_delivery_fee}
                    </span>
                  </div>
                </div>

                {/* Rute & Alamat */}
                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  {/* Titik Jemput: Kios Pasar Induk */}
                  <div className="p-3.5 rounded-lg border bg-muted/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <Store className="w-4 h-4 text-primary" />
                      <span>Titik Jemput ({uniqueStalls.size} Kios Lapak)</span>
                    </div>
                    <ul className="text-muted-foreground space-y-1 pl-5 list-disc">
                      {Array.from(uniqueStalls).map((stallName, idx) => (
                        <li key={idx} className="font-medium text-foreground">
                          {stallName}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-muted-foreground pt-1">
                      Total muatan: {t.items?.length || 0} jenis komoditas
                    </p>
                  </div>

                  {/* Titik Antar: Warung Pembeli */}
                  <div className="p-3.5 rounded-lg border bg-muted/40 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Tujuan Pengantaran Warung</span>
                    </div>
                    <p className="font-semibold text-foreground">
                      {address?.recipient_name || t.buyer?.name} (
                      {address?.store_name || buyerProfile?.store_name || "Warung"}
                      )
                    </p>
                    <p className="text-muted-foreground">
                      Telp: {address?.phone || t.buyer?.phone}
                    </p>
                    <p className="text-muted-foreground leading-relaxed line-clamp-2">
                      {address?.full_address || "Alamat belum tercatat"}
                    </p>
                  </div>
                </div>

                {/* Catatan Khusus Pesanan (jika ada) */}
                {t.notes && (
                  <div className="p-2.5 rounded-md bg-muted/50 text-[11px] text-muted-foreground">
                    <strong className="text-foreground">Catatan Pemesan: </strong>
                    {t.notes}
                  </div>
                )}

                {/* Footer Kartu & Tombol Klaim */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {isCOD ? (
                      <span className="font-semibold text-amber-600 flex items-center gap-1">
                        <Banknote className="w-3.5 h-3.5" />
                        Siapkan uang kembalian untuk total tagihan: {t.formatted_total_amount}
                      </span>
                    ) : (
                      <span className="font-semibold text-green-600 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        Pembayaran sudah lunas via transfer bank
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    disabled={isClaiming}
                    onClick={() => executeClaim(t.order_number)}
                    className="font-semibold text-xs h-9 px-4"
                  >
                    {isClaiming ? (
                      <>
                        <Spinner className="mr-1.5" />
                        Mengklaim...
                      </>
                    ) : (
                      <>
                        <Truck className="w-3.5 h-3.5 mr-1.5" />
                        Klaim Tugas Ini
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
