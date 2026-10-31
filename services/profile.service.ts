import instance from "@/lib/instance";
import {
  IProfileResponse,
  IUpdatePasswordRequest,
  IUpdateProfileRequest,
} from "@/types/profile";

const profile = {
  // Get active user profile
  getProfile: () => instance.get<IProfileResponse>("/profile"),

  // Update stall / store profile & personal info
  updateProfile: (payload: IUpdateProfileRequest) =>
    instance.put<IProfileResponse>("/profile", payload),

  // Change password
  updatePassword: (payload: IUpdatePasswordRequest) =>
    instance.put<{ message: string }>("/profile/password", payload),
};

export default profile;
