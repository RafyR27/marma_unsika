import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import ProfileSection from "@/components/views/ProfileSection/ProfileSection";

export const metadata = {
  title: "Profil Kurir Lapangan | Marma UNSIKA",
  description: "Pengaturan identitas kurir resmi pasar dan keamanan akun",
};

export default function CourierProfilePage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Profil Kurir" />
      <ProfileSection />
    </SidebarLayout>
  );
}
