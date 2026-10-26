import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerInventorySection from "@/components/views/SellerSection/Inventory/SellerInventorySection";

export const metadata = {
  title: "Stok & Kesegaran | Mitra Pedagang Marma",
  description: "Kelola kuantitas inventaris, stok menipis, dan ketersediaan komoditas pasar",
};

export default function SellerInventoryPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Stok & Kesegaran" />
      <SellerInventorySection />
    </SidebarLayout>
  );
}