import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import ProfileSection from "@/components/views/ProfileSection/ProfileSection";

export const metadata = {
  title: "Profil Lapak & Akun | Marma UNSIKA",
  description: "Pengaturan identitas toko, nomor blok pasar, alamat, dan keamanan akun",
};

export default function ProfilePage() {
  return (
    <MainLayout>
      <ProfileSection />
    </MainLayout>
  );
}
