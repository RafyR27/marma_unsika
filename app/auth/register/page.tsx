import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import RegisterSection from "@/components/views/AuthSection/RegisterSection/RegisterSection";

export const metadata = {
  title: "Daftar Akun | Marma",
  description: "Pilih peran akun Anda untuk mendaftar di Marma",
};

export default function Register() {
  return (
    <AuthLayout>
      <RegisterSection />
    </AuthLayout>
  );
}

