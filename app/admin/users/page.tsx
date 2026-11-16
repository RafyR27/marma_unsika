import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminUsersSection from "@/components/views/AdminSection/Users/AdminUsersSection";

export const metadata = {
  title: "Manajemen Pengguna | Admin Marma UNSIKA",
  description: "Kelola status aktivasi dan pendaftaran pengguna pasar induk, warung, dan kurir",
};

export default function AdminUsersAliasPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Manajemen Pengguna" />
      <AdminUsersSection />
    </SidebarLayout>
  );
}
