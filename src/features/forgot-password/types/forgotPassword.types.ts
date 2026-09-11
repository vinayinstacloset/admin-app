export type ForgotPasswordStep = "email" | "otp" | "new-password";

export interface SendOtpRequest {
    email: string;
}

export interface SendOtpResponse {
    message?: string;
    success?: boolean;
    [key: string]: unknown;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface VerifyOtpResponse {
    resetToken?: string;
    message?: string;
    success?: boolean;
    [key: string]: unknown;
}

export interface ResetPasswordRequest {
    email: string;
    resetToken?: string;
    newPassword: string;
}

export interface ResetPasswordResponse {
    message?: string;
    success?: boolean;
    [key: string]: unknown;
}
