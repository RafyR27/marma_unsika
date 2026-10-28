import MainLayout from "@/components/layouts/MainLayout/MainLayout";
import OrdersListSection from "@/components/views/OrdersListSection/OrdersListSection";

export const metadata = {
  title: "Pesanan Saya | Marma UNSIKA",
  description: "Daftar riwayat dan pelacakan pesanan komoditas pasar grosir",
};

export default function UserOrdersPage() {
  return (
    <MainLayout>
      <OrdersListSection />
    </MainLayout>
  );
}
