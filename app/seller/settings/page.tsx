import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import ProfileSection from "@/components/views/ProfileSection/ProfileSection";

export const metadata = {
  title: "Pengaturan Akun Kios | Mitra Pedagang Marma",
  description: "Pengaturan profil toko pasar dan keamanan kata sandi akun",
};

export default function SellerSettingsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pengaturan Akun" />
      <ProfileSection />
    </SidebarLayout>
  );
}
