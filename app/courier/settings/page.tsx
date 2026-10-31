import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import ProfileSection from "@/components/views/ProfileSection/ProfileSection";

export const metadata = {
  title: "Pengaturan Kurir | Marma UNSIKA",
  description: "Pengaturan akun kurir lapangan dan keamanan kata sandi",
};

export default function CourierSettingsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pengaturan Kurir" />
      <ProfileSection />
    </SidebarLayout>
  );
}
