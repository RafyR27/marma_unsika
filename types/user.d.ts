interface IRegister {
  name: string;
  phone: string;
  email?: string | null;
  password: string;
  password_confirmation: string;
  role: "seller" | "buyer" | string;
  store_name?: string | null;
  market_name?: string | null;
  block_number?: string | null;
  full_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface ILogin {
  phone: string;
  password: string;
}

interface IUserProfile {
  id: number;
  user_id: number;
  store_name?: string | null;
  market_name?: string | null;
  block_number?: string | null;
  full_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
}

interface IAuthUser {
  id: number;
  name: string;
  email?: string | null;
  phone: string;
  role: "seller" | "buyer" | "courier" | "admin" | string;
  is_active: boolean;
  profile?: IUserProfile | null;
  image?: string | null;
  avatar?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface IAuthResponse {
  message: string;
  data: {
    user: IAuthUser;
    token: string;
  };
}

type ILoginResponse = IAuthResponse;

interface IUserProfileResponse {
  data: IAuthUser;
}

interface IMessageResponse {
  message: string;
}

interface IValidationErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;

  role: string;
  statusVerifikasi: boolean;
  newAccount: boolean;
  noHP: string;
  noRumah: string;
  rejectionReason?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | string | null;
}

export type {
  SessionUser,
  IRegister,
  ILogin,
  IAuthUser,
  IUserProfile,
  IAuthResponse,
  ILoginResponse,
  IUserProfileResponse,
  IMessageResponse,
  IValidationErrorResponse,
};
