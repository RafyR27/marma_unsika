import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import ProfileSection from "@/components/views/ProfileSection/ProfileSection";

export const metadata = {
  title: "Profil Saya | Marma UNSIKA",
  description: "Pengaturan akun dan alamat pengiriman warung pembeli",
};

export default function UserProfilePage() {
  return (
    <MainLayout>
      <ProfileSection />
    </MainLayout>
  );
}

