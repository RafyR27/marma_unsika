import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerReviewsSection from "@/components/views/SellerSection/Reviews/SellerReviewsSection";

export const metadata = {
  title: "Ulasan Pembeli | Mitra Pedagang Marma",
  description: "Kepuasan pelanggan warung pembeli dan indeks kesegaran komoditas lapak",
};

export default function SellerReviewsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Ulasan Pembeli" />
      <SellerReviewsSection />
    </SidebarLayout>
  );
}
