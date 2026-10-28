import { IAuthUser } from "./user";

export interface IUpdateProfileRequest {
  name?: string;
  phone?: string;
  email?: string | null;
  store_name?: string | null;
  market_name?: string | null;
  block_number?: string | null;
  full_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface IUpdatePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface IProfileResponse {
  message?: string;
  data: IAuthUser;
}
