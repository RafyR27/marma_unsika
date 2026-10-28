import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import CheckoutSection from "@/components/views/CheckoutSection/CheckoutSection";

export const metadata = {
  title: "Checkout Pesanan Grosir | Marma UNSIKA",
  description: "Konfirmasi pesanan komoditas pasar induk dan alamat pengiriman warung",
};

export default function CheckoutPage() {
  return (
    <MainLayout>
      <CheckoutSection />
    </MainLayout>
  );
}
