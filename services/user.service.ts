import instance from "@/lib/instance";
import {
  IAuthResponse,
  IForgotPasswordRequest,
  ILogin,
  ILoginResponse,
  IMessageResponse,
  IRegister,
  IResetPasswordRequest,
  IUserProfileResponse,
} from "@/types/user";

const user = {
  // Pendaftaran akun pengguna (Buyer / Seller)
  register: (payload: IRegister) =>
    instance.post<IAuthResponse>("/auth/register", payload),

  // Masuk akun (nomor HP dan kata sandi)
  login: (payload: ILogin) =>
    instance.post<ILoginResponse>("/auth/login", payload),

  // Ambil profil pengguna yang sedang login beserta data kios
  me: () => instance.get<IUserProfileResponse>("/auth/me"),

  // Keluar dari sesi akun dan hapus token Sanctum di server
  logout: () => instance.post<IMessageResponse>("/auth/logout"),

  // Endpoint fallback verifikasi user Sanctum bawaan Laravel
  getSanctumUser: () => instance.get<IUserProfileResponse>("/user"),

  // Permintaan pengiriman instruksi pemulihan kata sandi (OTP/Token)
  forgotPassword: (payload: IForgotPasswordRequest) =>
    instance.post<IMessageResponse>("/auth/forgot-password", payload),

  // Konfirmasi reset kata sandi baru menggunakan token/kode pemulihan
  resetPassword: (payload: IResetPasswordRequest) =>
    instance.post<IMessageResponse>("/auth/reset-password", payload),
};

export default user;
