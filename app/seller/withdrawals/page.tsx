import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerEarningsSection from "@/components/views/SellerSection/Earnings/SellerEarningsSection";

export const metadata = {
  title: "Penarikan Dana Kios | Mitra Pedagang Marma",
  description: "Pencairan saldo omzet hasil penjualan komoditas pedagang pasar induk",
};

export default function SellerWithdrawalsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Penarikan Dana Kios" />
      <SellerEarningsSection />
    </SidebarLayout>
  );
}
