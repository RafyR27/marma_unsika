import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";

export const metadata = {
  title: "Pengaturan Akun Kios | Mitra Pedagang Marma",
  description: "Pengaturan profil toko pasar dan keamanan kata sandi akun",
};

export default function SellerSettingsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pengaturan Akun" />

    </SidebarLayout>
  );
}
