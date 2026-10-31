import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminVerifikasiSection from "@/components/views/AdminSection/Verifikasi/AdminVerifikasiSection";

export const metadata = {
  title: "Verifikasi Pembayaran | Admin Operasional Marma",
  description: "Verifikasi struk transfer bank pembeli untuk konfirmasi pesanan pasar grosir",
};

export default function AdminVerifikasiPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Verifikasi Pembayaran" />
      <AdminVerifikasiSection />
    </SidebarLayout>
  );
}
