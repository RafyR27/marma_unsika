import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminReimbursementSection from "@/components/views/AdminSection/Reimbursement/AdminReimbursementSection";

export const metadata = {
  title: "Pencairan Dana Pedagang & Kurir | Admin Marma UNSIKA",
  description: "Persetujuan dan pembukuan pencairan saldo hasil penjualan kios dan upah kurir",
};

export default function AdminReimbursementPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pencairan Dana" />
      <AdminReimbursementSection />
    </SidebarLayout>
  );
}
