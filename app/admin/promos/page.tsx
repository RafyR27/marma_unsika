import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import AdminPromosSection from "@/components/views/AdminSection/Promos/AdminPromosSection";

export const metadata = {
  title: "Promo & Voucher Subsidi | Admin Marma UNSIKA",
  description: "Pengelolaan kupon diskon ongkos kirim dan potongan harga grosir komoditas pasar",
};

export default function AdminPromosPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Promo & Voucher" />
      <AdminPromosSection />
    </SidebarLayout>
  );
}
