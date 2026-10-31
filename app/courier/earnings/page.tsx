import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import CourierEarningsSection from "@/components/views/CourierSection/Earnings/CourierEarningsSection";

export const metadata = {
  title: "Pendapatan & Kas COD | Kurir Lapangan Marma",
  description: "Rekapitulasi perolehan upah ongkos kirim dan pencatatan uang tunai titipan COD pasar",
};

export default function CourierEarningsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Pendapatan Kurir" />
      <CourierEarningsSection />
    </SidebarLayout>
  );
}
