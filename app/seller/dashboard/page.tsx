import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerDashboardSection from "@/components/views/SellerSection/Dashboard/SellerDashboardSection";

export const metadata = {
  title: "Dashboard Penjual | Mitra Pedagang Marma",
  description: "Kelola komoditas, stok persediaan, dan operasional kios pedagang pasar di Marma",
};

export default function SellerDashboardPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Dashboard Penjual" />
      <SellerDashboardSection />
    </SidebarLayout>
  );
}
