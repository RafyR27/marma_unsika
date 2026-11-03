import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminVerifikasiSection from "@/components/views/AdminSection/Verifikasi/AdminVerifikasiSection";

export const metadata = {
  title: "Verifikasi Pembayaran | Admin Operasional Marma",
  description: "Verifikasi struk transfer bank pembeli untuk konfirmasi pesanan pasar grosir",
};

export default function AdminPaymentsAliasPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Antrean Verifikasi Pembayaran" />
      <AdminVerifikasiSection />
    </SidebarLayout>
  );
}

