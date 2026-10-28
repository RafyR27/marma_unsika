import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminProductCatalogSection from "@/components/views/AdminSection/Catalog/AdminProductCatalogSection";

export const metadata = {
  title: "Katalog Master Seluruh Pasar | Admin Marma UNSIKA",
  description: "Pengawasan etalase, harga grosir, dan stok fisik komoditas seluruh kios pasar induk",
};

export default function AdminProductCatalogPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Katalog Produk Pasar" />
      <AdminProductCatalogSection />
    </SidebarLayout>
  );
}
