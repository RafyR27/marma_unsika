import instance from "@/lib/instance";
import {
  IAuthResponse,
  ILogin,
  ILoginResponse,
  IMessageResponse,
  IRegister,
  IUserProfileResponse,
} from "@/types/user";

const user = {
  register: (payload: IRegister) =>
    instance.post<IAuthResponse>("/auth/register", payload),
  login: (payload: ILogin) =>
    instance.post<ILoginResponse>("/auth/login", payload),
  me: () => instance.get<IUserProfileResponse>("/auth/me"),
  logout: () => instance.post<IMessageResponse>("/auth/logout"),
  getSanctumUser: () => instance.get<IUserProfileResponse>("/user"),
};

export default user;
