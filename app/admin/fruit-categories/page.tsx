import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminCategoriesSection from "@/components/views/AdminSection/Categories/AdminCategoriesSection";

export const metadata = {
  title: "Kategori Komoditas | Admin Marma UNSIKA",
  description: "Master pengelompokan komoditas buah, sayuran, dan bumbu dapur di pasar grosir",
};

export default function AdminCategoriesPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Kategori Buah & Komoditas" />
      <AdminCategoriesSection />
    </SidebarLayout>
  );
}
