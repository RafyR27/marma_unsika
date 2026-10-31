import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import SellerChatsSection from "@/components/views/SellerSection/Chats/SellerChatsSection";

export const metadata = {
  title: "Chat & Koordinasi Pembeli | Mitra Pedagang Marma",
  description: "Pusat komunikasi koordinasi pesanan grosir pedagang pasar induk dengan warung pembeli",
};

export default function SellerChatsPage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Chat Pembeli" />
      <SellerChatsSection />
    </SidebarLayout>
  );
}
