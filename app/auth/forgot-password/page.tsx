import AuthLayout from "@/components/layouts/AuthLayout/AuthLayout";
import ForgotPasswordSection from "@/components/views/AuthSection/ForgotPasswordSection/ForgotPasswordSection";

export const metadata = {
  title: "Lupa Kata Sandi | Marma UNSIKA",
  description: "Pemulihan kata sandi akun pedagang pasar, warung pembeli, dan kurir lapangan",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordSection />
    </AuthLayout>
  );
}
