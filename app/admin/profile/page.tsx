import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import ProfileSection from "@/components/views/ProfileSection/ProfileSection";

export const metadata = {
  title: "Profil Administrator | Admin Marma UNSIKA",
  description: "Pengaturan akun administrator operasional pasar",
};

export default function AdminProfilePage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Profil Admin" />
      <ProfileSection />
    </SidebarLayout>
  );
}
