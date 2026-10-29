import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerShipmentsSection from "@/components/views/SellerSection/Shipments/SellerShipmentsSection";

export const metadata = {
  title: "Pengiriman Berjalan | Mitra Pedagang Marma",
  description: "Pemantauan logistik armada kurir penjemputan dan pengantaran komoditas kios pasar",
};

export default function SellerShipmentsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pengiriman Berjalan" />
      <SellerShipmentsSection />
    </SidebarLayout>
  );
}
