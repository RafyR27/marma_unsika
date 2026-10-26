import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerProductsSection from "@/components/views/SellerSection/SellerProductsSection";

export const metadata = {
  title: "Produk Saya | Mitra Pedagang Marma",
  description: "Kelola komoditas dan etalase kios pedagang pasar di Marma",
};

export default function SellerProductsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Produk Saya" />
      <SellerProductsSection />
    </SidebarLayout>
  );
}

