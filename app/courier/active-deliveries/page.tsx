import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import ActiveDeliveriesSection from "@/components/views/CourierSection/ActiveDeliveries/ActiveDeliveriesSection";

export const metadata = {
  title: "Pengiriman Aktif | Kurir Lapangan Marma",
  description: "Rute pengambilan barang kios pasar induk dan pengantaran ke warung",
};

export default function ActiveDeliveriesPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pengiriman Aktif" />
      <ActiveDeliveriesSection />
    </SidebarLayout>
  );
}
