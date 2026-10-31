import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import AdminDashboardSection from "@/components/views/AdminSection/Dashboard/AdminDashboardSection";

export const metadata = {
  title: "Pusat Operasional Pasar | Admin Marma UNSIKA",
  description: "Pemantauan seluruh transaksi pasar, verifikasi keuangan, dan koordinasi armada kurir",
};

export default function SuperAdminDashboardPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Dashboard Admin" />
      <AdminDashboardSection />
    </SidebarLayout>
  );
}
