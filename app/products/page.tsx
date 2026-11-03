import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import HomeSection from "@/components/views/HomeSection/HomeSection";

export const metadata = {
  title: "Katalog Komoditas Pasar | Marma UNSIKA",
  description: "Jelajahi seluruh komoditas grosir segar langsung dari pedagang pasar induk",
};

export default function ProductsCatalogPage() {
  return (
    <MainLayout>
      <HomeSection />
    </MainLayout>
  );
}

