import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminTransactionsSection from "@/components/views/AdminSection/Transactions/AdminTransactionsSection";

export const metadata = {
  title: "Buku Transaksi Keuangan | Admin Marma UNSIKA",
  description: "Rekapitulasi seluruh transaksi tunai COD dan transfer bank resmi di platform pasar",
};

export default function AdminTransactionsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Transaksi Pasar" />
      <AdminTransactionsSection />
    </SidebarLayout>
  );
}
