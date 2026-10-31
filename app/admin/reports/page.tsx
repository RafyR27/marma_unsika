import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminReportsSection from "@/components/views/AdminSection/Reports/AdminReportsSection";

export const metadata = {
  title: "Laporan Kinerja Pasar | Admin Marma UNSIKA",
  description: "Analitik omzet GMV pasar, performa pengantaran kurir, dan komoditas terlaris",
};

export default function AdminReportsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Laporan Kinerja Pasar" />
      <AdminReportsSection />
    </SidebarLayout>
  );
}
