import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminUsersSection from "@/components/views/AdminSection/Users/AdminUsersSection";

export const metadata = {
  title: "Manajemen Pengguna Pasar | Admin Operasional Marma",
  description: "Kelola status aktivasi dan hak akses pedagang pasar induk, warung pembeli, dan kurir",
};

export default function AdminUsersPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Manajemen Pengguna" />
      <AdminUsersSection />
    </SidebarLayout>
  );
}
