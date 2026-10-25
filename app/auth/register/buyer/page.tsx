import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import RegisterPembeliSection from "@/components/views/AuthSection/RegisterPembeliSection/RegisterPembeliSection";

export const metadata = {
  title: "Daftar sebagai Pembeli | Marma",
  description: "Formulir pendaftaran akun pembeli di Marma",
};

export default function RegisterBuyerPage() {
  return (
    <AuthLayout>
      <RegisterPembeliSection />
    </AuthLayout>
  );
}
