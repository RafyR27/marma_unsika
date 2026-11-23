"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Store, ShieldCheck, Truck, Clock } from "lucide-react";

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="w-full border-t border-border bg-card mt-14 sm:mt-20">
      {/* Keunggulan / Value Proposition Bar */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-xs sm:text-sm">Langsung dari Pasar</p>
              <p className="text-[11px] text-muted-foreground">Pedagang lokal terpercaya</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-xs sm:text-sm">Produk Segar</p>
              <p className="text-[11px] text-muted-foreground">Kualitas terjamin setiap hari</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-xs sm:text-sm">Pengiriman Cepat</p>
              <p className="text-[11px] text-muted-foreground">Diantar kurir lokal</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-xs sm:text-sm">Pesan Fleksibel</p>
              <p className="text-[11px] text-muted-foreground">Bisa kapan saja dari rumah</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Deskripsi */}
          <div className="md:col-span-5 space-y-3">
            <Link
              href="/"
              className="text-primary font-heading font-bold text-xl tracking-tight inline-block"
            >
              Marma
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
              Platform pasar komoditas digital yang menghubungkan pedagang pasar tradisional dengan konsumen, menyediakan komoditas segar berkualitas langsung ke pintu Anda.
            </p>
            <p className="text-xs text-muted-foreground">
              📍 Karawang, Jawa Barat &bull; Universitas Singaperbangsa Karawang
            </p>
          </div>

          {/* Navigasi Cepat */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Navigasi</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/user/cart" className="hover:text-primary transition-colors">
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link href="/user/orders" className="hover:text-primary transition-colors">
                  Riwayat Pesanan
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-primary transition-colors">
                  Masuk Akun
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategori Komoditas Populer */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-semibold text-sm text-foreground">Komoditas Populer</h3>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                Bawang & Cabai
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                Sayuran Hijau
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                Buah Segar
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                Rempah & Bumbu
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                Umbi-umbian
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-muted text-muted-foreground">
                Kacang-kacangan
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {currentYear} Marma UNSIKA. Hak Cipta Dilindungi.</p>
          <p>Pasar Komoditas Digital Mahasiswa & Pedagang</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
