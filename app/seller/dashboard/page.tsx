import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerDashboardSection from "@/components/views/SellerSection/Dashboard/SellerDashboardSection";

export const metadata = {
  title: "Dashboard Kios | Mitra Pedagang Marma",
  description: "Ringkasan operasional kios pasar induk, antrean kemas barang, dan status etalase",
};

export default function SellerDashboardPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Dashboard Kios" />
      <SellerDashboardSection />
    </SidebarLayout>
  );
}
