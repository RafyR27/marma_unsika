import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminOrdersSection from "@/components/views/AdminSection/Orders/AdminOrdersSection";

export const metadata = {
  title: "Semua Pesanan Pasar | Admin Operasional Marma",
  description: "Audit seluruh transaksi pasar, penugasan kurir manual, dan pembatalan darurat",
};

export default function AdminOrdersPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Semua Pesanan" />
      <AdminOrdersSection />
    </SidebarLayout>
  );
}
