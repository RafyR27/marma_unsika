import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerEarningsSection from "@/components/views/SellerSection/Earnings/SellerEarningsSection";

export const metadata = {
  title: "Pendapatan Kios | Mitra Pedagang Marma",
  description: "Rekap omzet penjualan komoditas segar dan pencairan dana pedagang pasar induk",
};

export default function SellerEarningsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pendapatan Kios" />
      <SellerEarningsSection />
    </SidebarLayout>
  );
}
