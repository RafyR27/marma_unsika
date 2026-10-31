import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import CourierDashboardSection from "@/components/views/CourierSection/Dashboard/CourierDashboardSection";

export const metadata = {
  title: "Dashboard Kurir Lapangan | Marma UNSIKA",
  description: "Ringkasan penugasan pengantaran kurir pasar induk dan pemantauan tugas aktif",
};

export default function CourierDashboardPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Dashboard Kurir" />
      <CourierDashboardSection />
    </SidebarLayout>
  );
}
