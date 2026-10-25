import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import RegisterPenjualSection from "@/components/views/AuthSection/RegisterPenjualSection/RegisterPenjualSection";

export const metadata = {
  title: "Daftar sebagai Penjual | Marma",
  description: "Formulir pendaftaran akun mitra penjual di Marma",
};

export default function RegisterSellerPage() {
  return (
    <AuthLayout>
      <RegisterPenjualSection />
    </AuthLayout>
  );
}
