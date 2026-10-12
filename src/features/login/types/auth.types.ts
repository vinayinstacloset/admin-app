export interface AdminSummary {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
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
  admin?: AdminSummary;
  message?: string;
  [key: string]: unknown;
}
