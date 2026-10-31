import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AvailableTasksSection from "@/components/views/CourierSection/AvailableTasks/AvailableTasksSection";

export const metadata = {
  title: "Tugas Pengantaran Tersedia | Kurir Lapangan Marma",
  description: "Daftar pesanan pasar induk terkonfirmasi yang siap diklaim untuk diantar",
};

export default function AvailableTasksPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Tugas Tersedia" />
      <AvailableTasksSection />
    </SidebarLayout>
  );
}
