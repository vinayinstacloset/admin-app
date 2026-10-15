export interface AdminSummary {
  id?: string;
  name?: string;
  email?: string;
  mobile?: string;
  role?: string;
  profileImageUrl?: string | null;
}

export interface SendLoginOtpRequest {
  email: string;
  mobile: string;
}

export interface SendLoginOtpResponse {
  message?: string;
  [key: string]: unknown;
}

export interface VerifyLoginOtpRequest {
  email: string;
  mobile: string;
  otp: string;
}

export interface VerifyLoginOtpResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  name?: string;
  email?: string;
  mobile?: string;
  profileImageUrl?: string | null;
  role?: string;
  expiresIn?: number;
  tokenType?: string;
  adminReferenceId?: string | number;
  admin?: AdminSummary;
  message?: string;
  [key: string]: unknown;
}
