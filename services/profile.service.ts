import instance from "@/lib/instance";
import {
  IProfileResponse,
  IUpdatePasswordRequest,
  IUpdateProfileRequest,
} from "@/types/profile";

const profile = {
  // Ambil data profil pengguna lengkap langsung dari endpoint resmi /profile
  getProfile: () => instance.get<IProfileResponse>("/profile"),

  // Endpoint autentikasi sesi aktif /auth/me
  getAuthMe: () => instance.get<IProfileResponse>("/auth/me"),

  // Endpoint alternatif untuk mengambil data user Sanctum
  getSanctumUser: () => instance.get<IProfileResponse>("/user"),

  // Update profil pribadi dan data kios pedagang (PUT /profile)
  updateProfile: (payload: IUpdateProfileRequest) =>
    instance.put<IProfileResponse>("/profile", payload),

  // Ubah kata sandi akun (PUT /profile/password)
  updatePassword: (payload: IUpdatePasswordRequest) =>
    instance.put<{ message: string }>("/profile/password", payload),
};

export default profile;
