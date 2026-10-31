import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import CourierHistorySection from "@/components/views/CourierSection/History/CourierHistorySection";

export const metadata = {
  title: "Riwayat Pengantaran | Kurir Lapangan Marma",
  description: "Catatan riwayat pesanan komoditas yang telah selesai diantar kurir pasar",
};

export default function CourierHistoryPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Riwayat Pengiriman" />
      <CourierHistorySection />
    </SidebarLayout>
  );
}
