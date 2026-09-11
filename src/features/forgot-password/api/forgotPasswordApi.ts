import { getApiErrorMessage } from "../../../shared/api/apiError";
import { authClient } from "../../../shared/api/auth/authClient";
import type {
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from "../types/forgotPassword.types";

export const forgotPasswordService = {
    sendOtp: async (payload: SendOtpRequest): Promise<SendOtpResponse> => {
        try {
            const response = await authClient.post<SendOtpResponse>("/auth/admin/forgot-password/send-otp", payload);

            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Failed to send OTP. Please try again."));
        }
    },

    verifyOtp: async (payload: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
        try {
            const response = await authClient.post<VerifyOtpResponse>(
                "/auth/admin/forgot-password/verify-otp",
                payload,
            );

            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Invalid or expired OTP. Please try again."));
        }
    },

    resetPassword: async (payload: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        try {
            const response = await authClient.post<ResetPasswordResponse>(
                "/auth/admin/forgot-password/reset",
                payload,
            );

            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Failed to reset password. Please try again."));
        }
    },
};
