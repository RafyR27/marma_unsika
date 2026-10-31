import SidebarLayout from "@/components/layouts/Sidebar/SidebarLayout/SidebarLayout";
import { SiteHeader } from "@/components/layouts/Sidebar/common/SideBar/site-header";
import ProfileSection from "@/components/views/ProfileSection/ProfileSection";

export const metadata = {
  title: "Profil Kios Lapak | Mitra Pedagang Marma",
  description: "Pengaturan identitas kios pasar induk, nomor blok lapak, dan keamanan",
};

export default function SellerProfilePage() {
  return (
    <SidebarLayout>
      <SiteHeader title="Profil Kios" />
      <ProfileSection />
    </SidebarLayout>
  );
}
