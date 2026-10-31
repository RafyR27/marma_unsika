import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import CourierServiceAreaSection from "@/components/views/CourierSection/ServiceArea/CourierServiceAreaSection";

export const metadata = {
  title: "Peta Area Layanan | Kurir Lapangan Marma",
  description: "Zonasi penjemputan blok pasar induk dan rute pengantaran ke warung pembeli",
};

export default function CourierServiceAreaPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Area Layanan & Rute" />
      <CourierServiceAreaSection />
    </SidebarLayout>
  );
}
