import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerEarningsSection from "@/components/views/SellerSection/Earnings/SellerEarningsSection";

export const metadata = {
  title: "Laporan Penjualan | Mitra Pedagang Marma",
  description: "Laporan performa penjualan dan komoditas terlaris kios pasar induk",
};

export default function SellerReportsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Laporan Penjualan" />
      <SellerEarningsSection />
    </SidebarLayout>
  );
}
