import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import CourierEarningsSection from "@/components/views/CourierSection/Earnings/CourierEarningsSection";

export const metadata = {
  title: "Penarikan Dana Upah | Kurir Lapangan Marma",
  description: "Pencairan upah ongkir dan laporan uang tunai fisik COD kurir pasar",
};

export default function CourierWithdrawalsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Penarikan Upah Kurir" />
      <CourierEarningsSection />
    </SidebarLayout>
  );
}
