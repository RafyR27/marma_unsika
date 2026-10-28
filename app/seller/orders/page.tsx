import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerOrdersSection from "@/components/views/SellerSection/Orders/SellerOrdersSection";

export const metadata = {
  title: "Pesanan Masuk & Antrean Kemas | Mitra Pedagang Marma",
  description: "Kelola antrean pengemasan komoditas dan faktur pesanan masuk di kios pasar induk",
};

export default function SellerOrdersPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pesanan Masuk" />
      <SellerOrdersSection />
    </SidebarLayout>
  );
}
