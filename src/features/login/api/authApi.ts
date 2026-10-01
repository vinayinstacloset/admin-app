import { getApiErrorMessage } from "../../../shared/api/apiError";
import { authClient } from "../../../shared/api/auth/authClient";
import { useAuthStore } from "../../../store/zustand/authStore";
import type {
    SendLoginOtpRequest,
    SendLoginOtpResponse,
    VerifyLoginOtpRequest,
    VerifyLoginOtpResponse,
} from "../types/auth.types";

export const authService = {
    sendOtp: async (payload: SendLoginOtpRequest): Promise<SendLoginOtpResponse> => {
        try {
            const response = await authClient.post<SendLoginOtpResponse>("/auth/admin/login/send-otp", payload);

            return response.data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Failed to send OTP. Please try again."));
        }
    },

    verifyOtp: async (payload: VerifyLoginOtpRequest): Promise<VerifyLoginOtpResponse> => {
        try {
            const response = await authClient.post<VerifyLoginOtpResponse>("/auth/admin/login/verify-otp", payload);

            const data = response.data;
            const accessToken = data?.accessToken ?? data?.token;
            const refreshToken = data?.refreshToken;

            if (accessToken) {
                useAuthStore.getState().setTokens({ accessToken, refreshToken });
            }

            if (data?.admin) {
                useAuthStore.getState().setAdmin({
                    id: data.admin.id,
                    name: data.admin.name,
                    email: data.admin.email,
                    role: data.admin.role,
                });
            }

            return data;
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Invalid or expired OTP. Please try again."));
        }
    },

    logout: async (): Promise<void> => {
        const { refreshToken, clearAuth } = useAuthStore.getState();

        try {
            if (refreshToken) {
                await authClient.post("/auth/admin/logout", { refreshToken });
            }
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            clearAuth();
        }
    },

    isAuthenticated: (): boolean => {
        const { accessToken } = useAuthStore.getState();
        return Boolean(accessToken && accessToken.trim().length > 0);
    },
};
