import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";

export const metadata = {
  title: "Pengaturan Administrator | Admin Marma UNSIKA",
  description: "Pengaturan akun operasional pasar dan keamanan kata sandi",
};

export default function AdminSettingsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pengaturan Admin" />

    </SidebarLayout>
  );
}
